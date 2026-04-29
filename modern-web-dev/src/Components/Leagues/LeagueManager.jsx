import React, { useState, useEffect } from 'react';
import Parse from 'parse';
import MemberCard from './MemberCard';
import { getLiveStatus, getWeeklyTop } from '../../Services/getLeagues/getLeagueData';
import { fetchParseData } from '../../Services/parseServices/parseService';
import LeagueJoinParent from './LeagueJoinParent';
import LeagueCreateParent from './LeagueCreateParent';

// Helper to fetch Last.fm data for a member
const fetchMemberLastFmData = async (member) => {
  const lastFmUsername = member.lastfmUsername;
  if (!lastFmUsername) {
    return { currentSong: null, topSong: null };
  }
  
  try {
    const [currentSong, topSong] = await Promise.all([
      getLiveStatus(lastFmUsername),
      getWeeklyTop(lastFmUsername)
    ]);
    return { currentSong, topSong };
  } catch (err) {
    console.error(`Error fetching Last.fm data for ${lastFmUsername}:`, err);
    return { currentSong: null, topSong: null };
  }
};

export default function LeaguesManager() {
  const [leagues, setLeagues] = useState([]);
  const [leagueMembers, setLeagueMembers] = useState({}); // Map of leagueId -> members array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      const currentUser = Parse.User.current();
      
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch the Leagues relation
        const leaguesRelation = currentUser.relation("leagues");
        const leagueObjects = await leaguesRelation.query().find();
        
        // Convert Parse objects to plain JSON for easier rendering
        const leaguesJson = leagueObjects.map(l => ({
          id: l.id,
          ...l.attributes // This gets 'name', 'inviteCode', etc.
        }));
        
        setLeagues(leaguesJson);

        // 2. Fetch members for ALL leagues
        const membersMap = {};
        for (const league of leagueObjects) {
          const membersRelation = league.relation("members");
          const memberObjects = await membersRelation.query().find();
          
          // Fetch Last.fm data for each member in parallel
          const membersWithLastFm = await Promise.all(
            memberObjects.map(async (m) => {
              const memberData = {
                id: m.id,
                ...m.attributes
              };
              const { currentSong, topSong } = await fetchMemberLastFmData(memberData);
              return { ...memberData, currentSong, topSong };
            })
          );
          
          membersMap[league.id] = membersWithLastFm;
        }
        
        setLeagueMembers(membersMap);
      } catch (error) {
        console.error("Error loading league data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
}, []);

  const refreshLeagues = async () => {
    const currentUser = Parse.User.current();
    if (!currentUser) return;

    try {
      const leaguesRelation = currentUser.relation("leagues");
      const leagueObjects = await leaguesRelation.query().find();
      
      const leaguesJson = leagueObjects.map(l => ({
        id: l.id,
        ...l.attributes
      }));
      
      setLeagues(leaguesJson);

      const membersMap = {};
      for (const league of leagueObjects) {
        const membersRelation = league.relation("members");
        const memberObjects = await membersRelation.query().find();
        
        // Fetch Last.fm data for each member in parallel
        const membersWithLastFm = await Promise.all(
          memberObjects.map(async (m) => {
            const memberData = {
              id: m.id,
              ...m.attributes
            };
            const { currentSong, topSong } = await fetchMemberLastFmData(memberData);
            return { ...memberData, currentSong, topSong };
          })
        );
        
        membersMap[league.id] = membersWithLastFm;
      }
      
      setLeagueMembers(membersMap);
    } catch (error) {
      console.error("Error refreshing league data:", error);
    }
  };

  if (loading) return <div>Loading League...</div>;

  return (
    <div className="leagues-container p-6">
      {leagues.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-foreground mb-4">My Leagues</h2>
          <div className="flex flex-col gap-6">
            {leagues.map((league) => (
              <div key={league.objectId || league.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-card-foreground">{league.name}</h3>
                  <span className="text-sm text-muted-foreground">Code: {league.inviteCode}</span>
                </div>
                
                <div className="flex overflow-x-auto gap-4 pb-2">
                  {(leagueMembers[league.id] || []).length > 0 ? (
                    (leagueMembers[league.id] || []).map((member) => (
                      <MemberCard key={member.id || member.objectId} member={member} />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No members in this league yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {leagues.length === 0 && (
        <p className="text-muted-foreground">You haven't joined any leagues yet!</p>
      )}

      <div className="league-forms mt-8 flex flex-col gap-6">
        <LeagueJoinParent
          onJoinSuccess={refreshLeagues}
        />
        <LeagueCreateParent
          onCreateSuccess={refreshLeagues}
        />
      </div>
    </div>
  );
}