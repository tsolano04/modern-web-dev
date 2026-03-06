import React from 'react';

export default function MusicList({ music }) {
  return (
    <div className="musicListChild">
      <ol>
        {Array.isArray(music)
          ? music.map((m, i) => <li key={i}>{m}</li>)
          : null}
      </ol>
    </div>
  );
}
