import {
  html,
  useState,
} from "https://unpkg.com/htm/preact/standalone.module.js";

export default function addSong({ onChildClick, songsList }) {
  let [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    onChildClick(inputValue);
    setInputValue("");
  };

  return html`
    <div class="addSongChild">
      <input
        value=${inputValue}
        onInput=${(e) => setInputValue(e.target.value)}
        placeholder="Song name..."
      />
      <button onClick=${handleSubmit}>Submit</button>
      <h2>Added Songs:</h2>
      <ol>
        ${songsList}
      </ol>
    </div>
  `;
}
