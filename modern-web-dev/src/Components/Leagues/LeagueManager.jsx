import React, { useState, useEffect } from 'react';
import Parse from 'parse';
import MemberCard from './MemberCard';
import { getLiveStatus, getWeeklyTop } from '../../Services/getLeagues/getLeagueData';
import { fetchParseData } from '../../Services/parseServices/parseService';
import LeagueJoinParent from './LeagueJoinParent';
import LeagueCreateParent from './LeagueCreateParent';

export default function LeaguesManager() {
  const [leagues, setLeagues] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadLeagueData() {
    const currentUser = Parse.User.current();
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      // 1. Find leagues where user is a member
      const query = new Parse.Query("League");
      query.equalTo("members", currentUser);

      const userLeagues = await query.find();
      console.log("CURRENT USER:", currentUser.id);
      console.log("LEAGUES FOUND:");
      userLeagues.forEach(l => {
        console.log(l.get("name"));
      });

      const members = await query.find();

      console.log("MEMBERS IN LEAGUE:");
      members.forEach(m => {
        console.log(m.toJSON());
        console.log(m.get("username"), m.id);
      });

      setLeagues(userLeagues);

      // 2. Collect all unique members
      const allMembersMap = new Map();

      await Promise.all(
        userLeagues.map(async (league) => {
          const relation = league.relation("members");
          const members = await relation.query().find();

          members.forEach((member) => {
            if (member.id !== currentUser.id) {
              allMembersMap.set(member.id, member);
            }
          });
        })
      );

      // 3. Build member data (SYNC version)
      const memberData = Array.from(allMembersMap.values()).map((user) => {
        const username = user.get("username");
        const lastFmName = user.get("lastfmUsername");
        const profilePic = user.get("profilePicture")?.url?.() || null;
        console.log(username)

        return {
          id: user.id,
          username,
          profilePic,
          currentSong: {
            title: "No recent tracks",
            artist: "",
            isPlaying: false,
          },
          topSong: {
            title: "No tracks yet",
            artist: "",
            playcount: 0,
          },
        };
      });

      setMembers(memberData);
    } catch (err) {
      console.error("Error loading league data:", err);
    } finally {
      setLoading(false);
    }
  }

  loadLeagueData();
}, []);

  if (loading) return <div>Loading League...</div>;

  return (
    <div className="leagues-container">
      {leagues.length > 0 && (
        <>
          <h2>My Leagues</h2>
          <div className="leagues-list">
            {leagues.map((league) => (
              <div key={league.objectId || league.id} className="league-item">
                <h3>{league.name}</h3>
                <span className="invite-code">Code: {league.inviteCode}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {members.length > 0 && (
        <>
          <h2>League Members</h2>
          <div className="member-grid">
            {members.map((member) => (
              <MemberCard key={member.id || member.objectId} member={member} />
            ))}
          </div>
        </>
      )}

      {leagues.length === 0 && members.length === 0 && (
        <p className="empty-state">You haven't joined any leagues yet!</p>
      )}

      <div className="league-forms">
        <LeagueJoinParent
          onJoinSuccess={() => window.location.reload()}
        />
        <LeagueCreateParent
          onCreateSuccess={() => window.location.reload()}
        />
      </div>
    </div>
  );
}