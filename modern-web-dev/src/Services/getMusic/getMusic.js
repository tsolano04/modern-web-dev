import { fetchParseData } from '../parseServices/parseService';

export async function getMusic() {
  const posts = await fetchParseData('post');
  return { songs: posts };
}
