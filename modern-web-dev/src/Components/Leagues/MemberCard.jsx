import React from 'react';

export default function MemberCard({ member }) {
  const { username, firstName, profilePic, currentSong, topSong } = member;

  // Use firstName if available, fallback to username
  const displayName = firstName || username;
  
  // Default avatar fallback
  const avatarSrc = profilePic || 'https://via.placeholder.com/100?text=User';

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden min-w-[200px] max-w-[250px]">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        {profilePic ? (
          <img
            src={avatarSrc}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-muted shrink-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-muted-foreground">{displayName?.charAt(0)?.toUpperCase()}</span>
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold text-card-foreground truncate">{displayName}</h3>
        </div>
      </div>

      <div className="px-4 py-3 flex flex-col gap-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Currently Listening</p>
          {currentSong?.isPlaying ? (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs text-green-500 animate-pulse">●</span>
              <p className="text-sm text-card-foreground truncate">
                <span className="font-medium">{currentSong.title}</span>
                <span className="text-muted-foreground"> by {currentSong.artist}</span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">Not playing</p>
          )}
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Weekly Favorite</p>
          <p className="text-sm text-card-foreground mt-1">
            <span className="font-medium">{topSong?.title || 'N/A'}</span>
            {topSong?.playcount > 0 && (
              <span className="text-muted-foreground"> ({topSong.playcount} plays)</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}