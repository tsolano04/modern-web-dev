const API_KEY = process.env.REACT_APP_LASTFM_KEY;
const BASE_URL = "https://ws.audioscrobbler.com/2.0/";


const buildUrl = (method, params = {}) => {
  const query = new URLSearchParams({
    method,
    api_key: API_KEY,
    format: "json",
    ...params,
  }).toString();
  return `${BASE_URL}?${query}`;
};

export const LastFmUser = {
  getInfo: async (username) => {
    const response = await fetch(buildUrl("user.getinfo", { user: username }));
    if (!response.ok) throw new Error("User not found");
    const data = await response.json();
    return data.user;
  },

  getTopTracks: async (username, period = "7day") => {
    const response = await fetch(buildUrl("user.gettoptracks", { user: username, period }));
    const data = await response.json();
    return data.toptracks.track;
  }
};