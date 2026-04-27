import { LASTFM_CONFIG } from "./config";

export const searchTracks = async (query) => {
  if (!query) return [];
  const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${query}&api_key=${LASTFM_CONFIG.API_KEY}&format=json&limit=5`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    // Last.fm nests results deep: results.trackmatches.track
    console.log("Search results from Last.fm:", data);
    return data.results?.trackmatches?.track || [];
  } catch (error) {
    console.error("Last.fm search error:", error);
    return [];
  }
};

export const getTrackInfo = async (artist, track) => {
  const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_CONFIG.API_KEY}&artist=${artist}&track=${track}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Track info from Last.fm:", data);
    return data.track || null;
  } catch (error) {
    console.error("Last.fm track info error:", error);
    return null;
  }
};

export const getArtistTopTag = async (artist) => {
  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getTopTags&artist=${encodeURIComponent(artist)}&api_key=${LASTFM_CONFIG.API_KEY}&format=json`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.toptags?.tag?.[0]?.name || '';
  } catch (error) {
    console.error("Last.fm artist tag error:", error);
    return '';
  }
};
