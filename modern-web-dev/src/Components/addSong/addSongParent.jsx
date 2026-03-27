import React, { useState, useEffect } from 'react';
import AddSong from './addSongChild';
import { createParseData, fetchParseData } from '../../Services/parseServices/parseService';

function buildCommentsMap(comments) {
  const map = {};
  (comments || []).forEach((c) => {
    const postField = c.post;
    const postId = (postField && (postField.id || postField.objectId)) || (typeof postField === 'string' ? postField : null);
    if (!postId) return;
    if (!map[postId]) map[postId] = [];
    map[postId].push(c);
  });
  return map;
}

async function fetchPostsAndComments() {
  const [posts, comments] = await Promise.all([
    fetchParseData('post'),
    fetchParseData('comment', ['post']),
  ]);
  return { posts: posts || [], commentMap: buildCommentsMap(comments) };
}

export default function AddSongParent() {
  const [music, setMusic] = useState([]);
  const [commentsMap, setCommentsMap] = useState({});

  async function updateList(newSong) {
    setMusic((prev) => [...prev, newSong]);
    try {
      await createParseData('post', {
        title: newSong.title,
        genre: newSong.genre,
        suggester: newSong.suggester,
      });
      const { posts, commentMap } = await fetchPostsAndComments();
      setMusic(posts);
      setCommentsMap(commentMap);
    } catch (err) {
      console.error('Failed to create Parse post:', err);
    }
  }

  useEffect(() => {
    let mounted = true;
    fetchPostsAndComments().then(({ posts, commentMap }) => {
      if (!mounted) return;
      setMusic(posts);
      setCommentsMap(commentMap);
    });
    return () => { mounted = false; };
  }, []);

  async function addCommentToPost(postId, commenter, body) {
    try {
      await createParseData('comment', { commenter, body, post: postId });
      const { posts, commentMap } = await fetchPostsAndComments();
      setMusic(posts);
      setCommentsMap(commentMap);
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
