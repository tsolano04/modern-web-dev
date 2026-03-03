import { html } from "https://unpkg.com/htm/preact/standalone.module.js";

export default function musicList({ music }) {
  return html`
    <div class="musicListChild">
      <ol>
        ${music}
      </ol>
    </div>
  `;
}
