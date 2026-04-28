import React from 'react';

export default function MemberCard({ member }) {
  const { username, profilePic, currentSong, topSong } = member;

  // Default avatar fallback
  const avatarSrc = profilePic || 'https://via.placeholder.com/100?text=User';

  return (
    <div className="member-card">
      <div className="card-header">
        <img src={avatarSrc} alt={username} className="avatar" />
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
          <p className="inactive">{currentSong?.title || 'Not playing'}</p>
        )}
      </div>

      <div className="stats-section">
        <p className="label">Weekly Favorite:</p>
        <p>
          <strong>{topSong?.title || 'N/A'}</strong>
          {topSong?.playcount > 0 && <span> ({topSong.playcount} plays)</span>}
        </p>
      </div>
    </div>
  );
}