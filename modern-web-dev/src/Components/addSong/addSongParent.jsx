import React, { useState, useEffect } from 'react';
import AddSong from './addSongChild';
import { createParseData, fetchParseData, updateParseData } from '../../Services/parseServices/parseService';
import { searchTracks, getTrackInfo } from '../../Services/LastFm/GetSongData';

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

async function fetchImageUrl(title) {
  let trackName = title;
  let artistName = '';
  if (title.includes(' by ')) {
    const idx = title.indexOf(' by ');
    trackName = title.slice(0, idx);
    artistName = title.slice(idx + 4);
  }
  const tryDetails = async (artist, track) => {
    const details = await getTrackInfo(artist, track);
    const images = details?.album?.image;
    return (
      images?.find((img) => img.size === 'extralarge')?.['#text'] ||
      images?.find((img) => img.size === 'large')?.['#text'] ||
      ''
    );
  };
  if (artistName) {
    const url = await tryDetails(artistName, trackName);
    if (url) return url;
  }
  const results = await searchTracks(trackName);
  if (results.length > 0) {
    return await tryDetails(results[0].artist, results[0].name);
  }
  return '';
}

export default function AddSongParent() {
  const [music, setMusic] = useState([]);
  const [commentsMap, setCommentsMap] = useState({});
  const [backfillStatus, setBackfillStatus] = useState(null);

  async function updateList(newSong) {
    setMusic((prev) => [...prev, newSong]);
    try {
      await createParseData('post', {
        title: newSong.title,
        genre: newSong.genre,
        suggester: newSong.suggester,
        imageUrl: newSong.imageUrl || '',
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

  async function backfillArtwork() {
    const posts = await fetchParseData('post');
    const missing = posts.filter((p) => !p.imageUrl);
    if (missing.length === 0) {
      setBackfillStatus('All songs already have artwork.');
      return;
    }
    setBackfillStatus(`0 / ${missing.length}`);
    let done = 0;
    for (const post of missing) {
      const url = await fetchImageUrl(post.title);
      if (url) await updateParseData('post', post.objectId, { imageUrl: url });
      done++;
      setBackfillStatus(`${done} / ${missing.length}`);
    }
    const { posts: refreshed, commentMap } = await fetchPostsAndComments();
    setMusic(refreshed);
    setCommentsMap(commentMap);
    setBackfillStatus('Done!');
  }

  return (
    <div className="addSongParent">
      <AddSong onChildClick={updateList} songsList={music} onAddComment={addCommentToPost} commentsMap={commentsMap} />
    </div>
  );
}
