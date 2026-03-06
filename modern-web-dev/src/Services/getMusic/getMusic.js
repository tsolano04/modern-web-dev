// Async function that fetches from local music.json file
export async function getMusic() {
  const response = await fetch('/music.json');
  // If the project serves the file from public/ or root, fetch will return JSON
  if (!response.ok) throw new Error('Failed to load music.json');
  return await response.json();
}
