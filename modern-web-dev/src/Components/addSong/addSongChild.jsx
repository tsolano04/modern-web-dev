import React, { useState } from 'react';

export default function AddSong({ onChildClick, songsList, onAddComment, commentsMap = {} }) {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [suggester, setSuggester] = useState('');
  const [comments, setComments] = useState({});

  const handleSubmit = () => {
    if (!title) return;
    const payload = { title, genre, suggester };
    onChildClick(payload);
    setTitle('');
    setGenre('');
    setSuggester('');
  };
//input fields for song suggestion
  return (
    <div className="addSongChild">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Song title..."
      />
      <input
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        placeholder="Genre..."
      />
      <input
        value={suggester}
        onChange={(e) => setSuggester(e.target.value)}
        placeholder="Suggester name..."
      />
      <button onClick={handleSubmit}>Submit</button>
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
