import {
  html,
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

import musicList from "./musicListChild.js";
import { getMusic } from "../../Services/getMusic/getMusic.js";

export default function musicListParent() {
  const [music, setMusic] = useState([]);

  useEffect(() => {
    getMusic().then((data) => setMusic(data.songs));
  }, []);

  const musicData = music.map((song) => html`<li>${song.title}</li>`);

  return html`
    <div class="musicListParent">
      <${musicList} music=${musicData} />
    </div>
  `;
}
