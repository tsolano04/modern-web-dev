import React, { useState, useEffect } from 'react';
import Parse from 'parse';
import MemberCard from './MemberCard';
// Imagine these are your API helpers
import { getLiveStatus, getWeeklyTop } from '../../Services/getLeagues/getLeagueData'; 

export default function LeaguesManager() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeagueData() {
      // 1. Get the current user's league members from Parse
      const User = Parse.User.current();
      const leagueQuery = new Parse.Query("League");
      leagueQuery.equalTo("members", User);
      
      try {
        const league = await leagueQuery.first();
        const memberList = league.get("members"); // Array of User pointers

        // 2. Fetch music data for each member
        const memberData = await Promise.all(memberList.map(async (m) => {
          await m.fetch(); // Get username and profile pic
          const username = m.get("username");
          const lastFmName = m.get("lastFmUsername"); // Assume you stored this

          const [current, weekly] = await Promise.all([
            getLiveStatus(lastFmName),
            getWeeklyTop(lastFmName)
          ]);

          return {
            id: m.id,
            username: username,
            profilePic: m.get("profilePicture")?.url() || 'default-avatar.png',
            currentSong: current, // { title, artist, isPlaying }
            topSong: weekly     // { title, artist, playcount }
          };
        }));

        setMembers(memberData);
      } catch (err) {
        console.error("Error loading league:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLeagueData();
  }, []);

  if (loading) return <div>Loading League...</div>;

  return (
    <div className="leagues-container">
      <h2>My Leagues</h2>
      <div className="member-grid">
        {members.map(member => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
      <h2>Join a League!</h2>
        <form>
            <input type="text" placeholder="Enter League Code" />
            <button type="submit">Join</button>
        </form>
        <h2>Create a League!</h2>
        <form>
            <input type="text" placeholder="League Name" />
            <button type="submit">Create</button>
        </form>
    </div>
  );
}