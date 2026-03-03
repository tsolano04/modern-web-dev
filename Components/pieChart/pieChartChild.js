import {
  html,
  useState,
} from "https://unpkg.com/htm/preact/standalone.module.js";

export default function pieChart({ getParameter, pieData }) {
  let [selectedParameter, setParameter] = useState();

  //handles whenever a parameter from the dropdown changes
  const handleDropdown = (parameter) => {
    getParameter(parameter);
  };

  return html`
    <div class="parameterDropdownChild">
      <select
        value=${selectedParameter}
        onChange=${(e) => handleDropdown(e.target.value)}
      >
        <!-- MAKE DEPENDENT ON JSON LATER -->
        <option value="genre">Genre</option>
        <option value="artist">Artist</option>
      </select>
      <ul>
        ${pieData}
      </ul>
    </div>
  `;
}
