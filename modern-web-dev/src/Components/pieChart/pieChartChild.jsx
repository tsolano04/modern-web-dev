import React, { useState } from 'react';

export default function PieChart({ getParameter, pieData }) {
  const [selectedParameter, setSelectedParameter] = useState('genre');

  const handleDropdown = (parameter) => {
    setSelectedParameter(parameter);
    if (typeof getParameter === 'function') getParameter(parameter);
  };

  return (
    <div className="parameterDropdownChild">
      <select
        value={selectedParameter}
        onChange={(e) => handleDropdown(e.target.value)}
      >
        <option value="genre">Genre</option>
        <option value="artist">Artist</option>
      </select>
      <ul>
        {Array.isArray(pieData)
          ? pieData.map((p, i) => <li key={i}>{p}</li>)
          : null}
      </ul>
    </div>
  );
}
