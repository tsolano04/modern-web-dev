import {
  html,
  render,
} from "https://unpkg.com/htm/preact/standalone.module.js";
import Components from "./Components/Components.js";

function App() {
  return html` <${Components} />`;
}

render(html` <${App} /> `, document.getElementById("app"));
