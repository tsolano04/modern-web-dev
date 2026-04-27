import React, { useState, useEffect } from 'react';
import MusicList from './musicListChild';
import { getMusic } from '../../Services/getMusic/getMusic';

export default function MusicListParent() {
  const [music, setMusic] = useState([]);

  useEffect(() => {
    getMusic().then((data) => setMusic(data.songs || []));
  }, []);

  return (
    <div className="musicListParent">
      <MusicList music={music} />
    </div>
  );
}
