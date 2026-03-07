import React, { useState, useEffect } from 'react';
import AddSong from './addSongChild';
import { createParseData } from '../../Services/parseServices/parseCreate';
import { fetchParseData } from '../../Services/parseServices/parseFetch';

export default function AddSongParent() {
  const [music, setMusic] = useState([]);
  const [commentsMap, setCommentsMap] = useState({});

  async function updateList(newSong) {
    // optimistic UI update
    setMusic((prev) => [...prev, newSong]);

    try {
      await createParseData('post', {
        title: newSong.title,
        genre: newSong.genre,
        suggester: newSong.suggester,
      });
      const fresh = await fetchParseData('post');
      setMusic(fresh);
    } catch (err) {
      console.error('Failed to create Parse post:', err);
    }
  }

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const posts = await fetchParseData('post');
      if (!mounted) return;
      setMusic(posts || []);
      // fetch comments and group by post id
      const comments = await fetchParseData('comment');
      const map = {};
      (comments || []).forEach((c) => {
        // post can be a pointer object ({ __type: 'Pointer', className: 'post', objectId: '...' })
        // or sometimes `toJSON()` returns { post: { objectId: '...' } }
        const postField = c.post;
        const postId = (postField && (postField.id || postField.objectId)) || (typeof postField === 'string' ? postField : null);
        if (!postId) return;
        if (!map[postId]) map[postId] = [];
        map[postId].push(c);
      });
      setCommentsMap(map);
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function addCommentToPost(postId, commenter, body) {
    try {
      // createParseData will convert 'post' to a pointer when provided a string id
      await createParseData('comment', { commenter, body, post: postId });
      const fresh = await fetchParseData('post');
      setMusic(fresh);
      // refresh comments
      const comments = await fetchParseData('comment');
      const map = {};
      (comments || []).forEach((c) => {
        const postField = c.post;
        const postId = (postField && (postField.id || postField.objectId)) || (typeof postField === 'string' ? postField : null);
        if (!postId) return;
        if (!map[postId]) map[postId] = [];
        map[postId].push(c);
      });
      setCommentsMap(map);
    } catch (err) {
      console.error('Failed to create comment:', err);
    }
  }

  return (
    <div className="addSongParent">
      <AddSong onChildClick={updateList} songsList={music} onAddComment={addCommentToPost} commentsMap={commentsMap} />
    </div>
  );
}
