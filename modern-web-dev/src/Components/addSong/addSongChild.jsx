import React, { useState } from 'react';

export default function AddSong({ onChildClick, songsList }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (!inputValue) return;
    onChildClick(inputValue);
    setInputValue('');
  };

  return (
    <div className="addSongChild">
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Song name..."
      />
      <button onClick={handleSubmit}>Submit</button>
      <h2>Added Songs:</h2>
      <ol>
        {Array.isArray(songsList)
          ? songsList.map((s, i) => <li key={i}>{s}</li>)
          : null}
      </ol>
    </div>
  );
}
