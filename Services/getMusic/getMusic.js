//Async function that fetches from local music.json file
export async function getMusic() {
  const axios = window.axios;
  const response = await axios.get("./music.json");
  return response.data;
}
