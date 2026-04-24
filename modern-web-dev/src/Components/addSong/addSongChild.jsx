import React, { useState, useEffect } from 'react';
import { searchTracks, getTrackInfo } from '../../Services/LastFm/GetSongData';
import Parse from 'parse'; 

export default function AddSong({ onChildClick, songsList, onAddComment, commentsMap = {} }) {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [comments, setComments] = useState({});
  const [isProcessingSelection, setIsProcessingSelection] = useState(false);

  const currentUser = Parse.User.current();
  const suggesterName = currentUser ? currentUser.get("username") : "Anonymous";

  useEffect(() => {
    // Don't search if we just selected a song or the input is too short
    if (isProcessingSelection || title.length < 3) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      const results = await searchTracks(title);
      setSearchResults(results);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [title, isProcessingSelection]);

  const selectSong = (song) => {
    setTitle(`${song.name} by ${song.artist}`);
    setGenre(song.genre || 'Unknown'); 
    setSearchResults([]);
  };

  const handleSelectSong = async (song) => {
    // Lock the search so it doesn't re-trigger when setTitle runs
    setIsProcessingSelection(true);
    
    const displayTitle = `${song.name} by ${song.artist}`;
    setTitle(displayTitle);
    setSearchResults([]);

    // Automatically fetch track info for the genre
    const details = await getTrackInfo(song.artist, song.name);
    if (details && details.toptags && details.toptags.tag.length > 0) {
      setGenre(details.toptags.tag[0].name); // Take the top tag as genre
    } else {
      setGenre('Unknown');
    }

    // Unlock searching only if the user clears the box or changes it later
    // (Or keep it locked until Submit)
  };

  const handleSubmit = () => {
    if (!title) return;
    const payload = { title, genre, suggester: suggesterName };
    onChildClick(payload);
    setTitle('');
    setGenre('');
  };

  return (
    <div className="addSongChild">
      <div className="search-box" style={{ position: 'relative' }}>
        <input
          value={title}
          onChange={(e) => {
            setIsProcessingSelection(false); // Unlock if they start typing again
            setTitle(e.target.value);
          }}
          placeholder="Type a song name..."
        />

        {searchResults.length > 0 && (
          <ul className="dropdown">
            {searchResults.map((song, i) => (
              <li key={i} onClick={() => handleSelectSong(song)}>
                {song.name} — {song.artist}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="info-preview">
        <p><strong>Genre:</strong> {genre || 'Select a song...'}</p>
        <p><strong>Suggester:</strong> {suggesterName}</p>
      </div>

      <button onClick={handleSubmit} disabled={!title}>Add Song</button>

      <hr />

      <h2>Added Songs:</h2>
      <div className="posts">
        {Array.isArray(songsList)
          ? songsList.map((s, i) => {
              const post = s && typeof s === 'object' ? s : { title: s };
              const id = post.objectId || post.objectId === 0 ? post.objectId : post.id || i;
              return (
                <div key={id} className="post">
                  <h3>{post.title}</h3>
                  {(post.genre || post.suggester) && (
                    <div className="meta">
                      {post.genre && <span className="genre">{post.genre}</span>}
                      {post.suggester && <span className="suggester"> — suggested by {post.suggester}</span>}
                    </div>
                  )}
                  <div className="existing-comments">
                    {(commentsMap[id] || []).length > 0 && (
                      <>
                        <h4>Comments</h4>
                        <ul>
                          {(commentsMap[id] || []).map((c, ci) => (
                            <li key={c.objectId || ci}>{c.commenter}: {c.body}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                  <div className="comments">
                    <label>New comment</label>
                    <input
                      value={(comments[id] && comments[id].commenter) || ''}
                      onChange={(e) =>
                        setComments((prev) => ({
                          ...prev,
                          [id]: { ...(prev[id] || {}), commenter: e.target.value },
                        }))
                      }
                      placeholder="Your name"
                    />
                    <textarea
                      value={(comments[id] && comments[id].body) || ''}
                      onChange={(e) =>
                        setComments((prev) => ({
                          ...prev,
                          [id]: { ...(prev[id] || {}), body: e.target.value },
                        }))
                      }
                      placeholder="Add a comment..."
                    />
                    <button
                      disabled={!post.objectId && !(post.id && typeof post.id === 'string')}
                      title={!post.objectId && !(post.id && typeof post.id === 'string') ? 'Cannot comment until song is saved.' : ''}
                      onClick={() => {
                        const c = comments[id] || {};
                        if (!c.body) return;
                        if (!post.objectId && !(post.id && typeof post.id === 'string')) {
                          // avoid submitting comment for posts without a Parse id
                          console.warn('Cannot add comment: post has no objectId yet');
                          return;
                        }
                        const targetId = post.objectId || post.id || id;
                        if (typeof onAddComment === 'function') {
                          onAddComment(targetId, c.commenter || 'Anonymous', c.body);
                          setComments((prev) => ({ ...prev, [id]: { commenter: '', body: '' } }));
                        }
                      }}
                    >
                      Add comment
                    </button>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}
