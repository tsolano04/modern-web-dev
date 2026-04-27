

export const getLiveStatus = async (username) => {
  try {
    const response = await fetch(`/api/lastfm/live-status?user=${username}`);
    if (!response.ok) throw new Error("Failed to fetch live status");
    const data = await response.json();
    return {
      title: data.currentTrack.name,
      artist: data.currentTrack.artist["#text"],
      isPlaying: data.currentTrack["@attr"]?.nowplaying === "true"
    };
  } catch (err) {
    console.error("Error fetching live status:", err);
    return { title: "Unknown", artist: "Unknown", isPlaying: false };
  }
};

export const getWeeklyTop = async (username) => {
  try {
    const response = await fetch(`/api/lastfm/top-tracks?user=${username}&period=7day`);
    if (!response.ok) throw new Error("Failed to fetch top tracks");
    const data = await response.json();
    const topTrack = data.toptracks.track[0];
    return {
      title: topTrack.name,
      artist: topTrack.artist.name,
      playcount: topTrack.playcount
    };
  } catch (err) {
    console.error("Error fetching weekly top track:", err);
    return { title: "Unknown", artist: "Unknown", playcount: 0 };
  }
};  