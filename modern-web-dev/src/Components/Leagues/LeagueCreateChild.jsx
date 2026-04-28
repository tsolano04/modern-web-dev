import React from 'react';

export default function LeagueCreateChild({ leagueName, setLeagueName, loading, error, onCreate }) {
  return (
    <div className="league-create-form">
      <h3>Create a League</h3>
      <p className="form-description">Create your own league and invite friends to join</p>

      <form onSubmit={onCreate} className="create-form">
        <div className="input-group">
          <input
            type="text"
            value={leagueName}
            onChange={(e) => setLeagueName(e.target.value)}
            placeholder="Enter League Name"
            className="league-name-input"
            maxLength={30}
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
          disabled={loading || !leagueName.trim()}
        >
          {loading ? 'Creating...' : 'Create League'}
        </button>
      </form>

      <div className="help-text">
        <p>After creating, share the invite code with friends so they can join!</p>
      </div>
    </div>
  );
}