import React, { useState } from 'react';
import LeagueCreateChild from './LeagueCreateChild';
import { createParseData } from '../../Services/parseServices/parseService';
import Parse from 'parse';

function generateInviteCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function LeagueCreateParent({ onCreateSuccess, onError }) {
  const [leagueName, setLeagueName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

    const handleCreate = async (e) => {
    e.preventDefault();
    if (!leagueName.trim()) {
        setError('Please enter a league name');
        return;
    }

    setLoading(true);
    setError('');

    try {
        const currentUser = Parse.User.current();

        const League = Parse.Object.extend("League");
        const newLeague = new League();
        const inviteCode = generateInviteCode();

        newLeague.set("name", leagueName.trim());
        newLeague.set("createdBy", currentUser);
        newLeague.set("inviteCode", inviteCode);

        // Add relation: league → user
        newLeague.relation("members").add(currentUser);

        await newLeague.save();

        // Add relation: user → league
        currentUser.relation("leagues").add(newLeague);
        await currentUser.save();

        setLeagueName('');
        if (onCreateSuccess) onCreateSuccess(newLeague);
        
    } catch (err) {
        console.error('Error creating league:', err);
        setError(err.message || 'Failed to create league.');
    } finally {
        setLoading(false);
    }
    };

  return (
    <LeagueCreateChild
      leagueName={leagueName}
      setLeagueName={setLeagueName}
      loading={loading}
      error={error}
      onCreate={handleCreate}
    />
  );
}