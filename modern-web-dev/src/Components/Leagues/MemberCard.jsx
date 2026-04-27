import React from 'react';

export default function MemberCard({ member }) {
  const { username, profilePic, currentSong, topSong } = member;

  return (
    <div className="member-card">
      <div className="card-header">
        <img src={profilePic} alt={username} className="avatar" />
        <h3>{username}</h3>
      </div>

      <div className="status-section">
        <p className="label">Currently Listening:</p>
        {currentSong?.isPlaying ? (
          <div className="live-status">
            <span className="pulse-icon">●</span>
            <strong>{currentSong.title}</strong> by {currentSong.artist}
          </div>
        ) : (
          <p className="inactive">Shhh... Silence.</p>
        )}
      </div>

      <div className="stats-section">
        <p className="label">Weekly Favorite:</p>
        <p>
          <strong>{topSong?.title}</strong> ({topSong?.playcount} plays)
        </p>
      </div>
    </div>
  );
}