

import { LASTFM_CONFIG } from "../LastFm/config";

export const getLiveStatus = async (username) => {
  try {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${username}&limit=1&api_key=${LASTFM_CONFIG.API_KEY}&format=json`
    );
    const data = await response.json();
    
    if (data.recenttracks?.track?.[0]) {
      const track = data.recenttracks.track[0];
      // Check if the track is currently playing (has @attr with nowplaying)
      const isPlaying = track?.['@attr']?.nowplaying === "true";
      return {
        title: track.name,
        artist: track.artist?.['#text'] || track.artist?.name || "Unknown",
        isPlaying
      };
    }
    return { title: null, artist: null, isPlaying: false };
  } catch (err) {
    console.error("Error fetching live status:", err);
    return { title: "Unknown", artist: "Unknown", isPlaying: false };
  }
};

export const getWeeklyTop = async (username) => {
  try {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user=${username}&period=7day&limit=1&api_key=${LASTFM_CONFIG.API_KEY}&format=json`
    );
    const data = await response.json();
    
    if (data.toptracks?.track?.[0]) {
      const topTrack = data.toptracks.track[0];
      return {
        title: topTrack.name,
        artist: topTrack.artist?.name || "Unknown",
        playcount: parseInt(topTrack.playcount, 10) || 0
      };
    }
    return { title: null, artist: null, playcount: 0 };
  } catch (err) {
    console.error("Error fetching weekly top track:", err);
    return { title: "Unknown", artist: "Unknown", playcount: 0 };
  }
};  