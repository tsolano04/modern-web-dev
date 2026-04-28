import React from 'react';

export default function LeagueJoinChild({ inviteCode, setInviteCode, loading, error, onJoin }) {
  return (
    <div className="league-join-form">
      <h3>Join a League</h3>
      <p className="form-description">Enter the invite code shared by a league member</p>

      <form onSubmit={onJoin} className="join-form">
        <div className="input-group">
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="Enter League Code"
            className="invite-input"
            maxLength={8}
            disabled={loading}
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full text-xs py-1.5 rounded-md border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          disabled={loading || !inviteCode.trim()}
        >
          {loading ? 'Joining...' : 'Join League'}
        </button>
      </form>

      <div className="help-text">
        <p>Don't have a code? Ask a league member to share theirs!</p>
      </div>
    </div>
  );
}