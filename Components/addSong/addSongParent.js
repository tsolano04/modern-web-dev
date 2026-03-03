import {
  html,
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

import addSong from "./addSongChild.js";

export default function addSongParent() {
  const [music, setMusic] = useState([]);

  function updateList(newSong) {
    setMusic([...music, newSong]);
  }

  console.log(music);

  const newMusic = music.map((m) => html`<li>${m}</li>`);
  console.log(newMusic);

  return html`
    <div class="addSongParent">
      <${addSong} onChildClick=${updateList} songsList=${newMusic} />
    </div>
  `;
}
