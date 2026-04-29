import React, { useState } from 'react';
import LeagueJoinChild from './LeagueJoinChild';
import { fetchParseData, updateParseData } from '../../Services/parseServices/parseService';
import Parse from 'parse';

export default function LeagueJoinParent({ onJoinSuccess, onError }) {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setError('Please enter a league code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Find league by invite code
        const leagueQuery = new Parse.Query("League");
        leagueQuery.equalTo("inviteCode", inviteCode.trim().toUpperCase());

        const league = await leagueQuery.first();

      if (!league) {
        setError('Invalid league code. Please check and try again.');
        setLoading(false);
        return;
      }

      // Get current user
      const currentUser = Parse.User.current();
      if (!currentUser) {
        setError('You must be logged in to join a league');
        setLoading(false);
        return;
      }

      // Add user to league's members array
        const relation = league.relation("members");
        const query = relation.query();

        const members = await query.find();

        const isMember = members.some(m => m.id === currentUser.id);

        if (isMember) {
        setError('You are already a member of this league');
        setLoading(false);
        return;
        }

        currentUser.relation("leagues").add(league);
        await currentUser.save();
        
        relation.add(currentUser);

        await league.save();

      // Clear form and notify parent
      setInviteCode('');
      if (onJoinSuccess) {
        onJoinSuccess(league);
      }
    } catch (err) {
      console.error('Error joining league:', err);
      setError(err.message || 'Failed to join league. Please try again.');
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LeagueJoinChild
      inviteCode={inviteCode}
      setInviteCode={setInviteCode}
      loading={loading}
      error={error}
      onJoin={handleJoin}
    />
  );
}