import React, { useState } from 'react';
import AddSong from './addSongChild';

export default function AddSongParent() {
  const [music, setMusic] = useState([]);

  function updateList(newSong) {
    setMusic((prev) => [...prev, newSong]);
  }

  return (
    <div className="addSongParent">
      <AddSong onChildClick={updateList} songsList={music} />
    </div>
  );
}
