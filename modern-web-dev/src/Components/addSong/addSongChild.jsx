import React, { useState, useEffect } from 'react';
import Parse from 'parse';
import { searchTracks, getTrackInfo } from '../../Services/LastFm/GetSongData';

export default function AddSong({ onChildClick, songsList, onAddComment, commentsMap = {} }) {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [comments, setComments] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isProcessingSelection, setIsProcessingSelection] = useState(false);

  const currentUser = Parse.User.current();
  const suggesterName = currentUser?.get('firstName') || currentUser?.get('username') || 'Anonymous';

  useEffect(() => {
    if (isProcessingSelection || title.length < 3) {
      setSearchResults([]);
      return;
    }
    const delay = setTimeout(async () => {
      const results = await searchTracks(title);
      setSearchResults(results);
    }, 400);
    return () => clearTimeout(delay);
  }, [title, isProcessingSelection]);

  const handleSelectSong = async (song) => {
    setIsProcessingSelection(true);
    setTitle(`${song.name} by ${song.artist}`);
    setSearchResults([]);
    const details = await getTrackInfo(song.artist, song.name);
    if (details?.toptags?.tag?.length > 0) {
      setGenre(details.toptags.tag[0].name);
    } else {
      setGenre('Unknown');
    }
  };

  const handleSubmit = () => {
    if (!title) return;
    const payload = { title, genre, suggester: suggesterName };
    onChildClick(payload);
    setTitle('');
    setGenre('');
    setIsProcessingSelection(false);
  };

  return (
    <div className="addSongChild">
      <div className="bg-muted border border-border rounded-lg p-4 mb-6">
        <h2 className="text-base font-semibold text-foreground mb-3">Suggest a Song</h2>
        <div className="flex flex-col gap-2">
          <div className="relative">
            <input
              className="w-full rounded border border-input bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              value={title}
              onChange={(e) => {
                setIsProcessingSelection(false);
                setTitle(e.target.value);
              }}
              placeholder="Song title..."
            />
            {searchResults.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-md overflow-hidden">
                {searchResults.map((song, i) => (
                  <li
                    key={i}
                    className="px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    onClick={() => handleSelectSong(song)}
                  >
                    {song.name} — {song.artist}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            className="w-full rounded border border-input bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Genre..."
          />
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">Submitting as <span className="font-medium text-foreground">{suggesterName}</span></span>
            <button
              className="text-sm px-4 py-1.5 rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
              disabled={!title}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">Added Songs</h2>
      <div className="flex flex-col gap-4">
        {Array.isArray(songsList)
          ? songsList.map((s, i) => {
              const post = s && typeof s === 'object' ? s : { title: s };
              const id = post.objectId || post.objectId === 0 ? post.objectId : post.id || i;
              return (
                <div key={id} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <h3 className="font-semibold text-card-foreground">{post.title}</h3>
                    {(post.genre || post.suggester) && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {post.genre && <span>{post.genre}</span>}
                        {post.genre && post.suggester && <span> · </span>}
                        {post.suggester && <span>suggested by {post.suggester}</span>}
                      </p>
                    )}
                  </div>

                  <div className="px-4 py-3 flex flex-col gap-3">
                    {(commentsMap[id] || []).length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Comments</p>
                        <ul className="flex flex-col gap-1.5">
                          {(commentsMap[id] || []).map((c, ci) => (
                            <li key={c.objectId || ci} className="text-sm bg-muted rounded px-3 py-1.5">
                              <span className="font-medium text-foreground">{c.commenter}</span>
                              <span className="text-muted-foreground">: {c.body}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 pt-1 border-t border-border">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Add a comment</p>
                      <textarea
                        className="w-full rounded border border-input bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                        rows={2}
                        value={(comments[id] && comments[id].body) || ''}
                        onChange={(e) =>
                          setComments((prev) => ({
                            ...prev,
                            [id]: { ...(prev[id] || {}), body: e.target.value },
                          }))
                        }
                        placeholder="Add a comment..."
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Commenting as <span className="font-medium text-foreground">{suggesterName}</span></span>
                        <button
                          className="text-sm px-3 py-1.5 rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={!post.objectId && !(post.id && typeof post.id === 'string')}
                          title={!post.objectId && !(post.id && typeof post.id === 'string') ? 'Cannot comment until song is saved.' : ''}
                          onClick={() => {
                            const c = comments[id] || {};
                            if (!c.body) return;
                            if (!post.objectId && !(post.id && typeof post.id === 'string')) return;
                            const targetId = post.objectId || post.id || id;
                            if (typeof onAddComment === 'function') {
                              onAddComment(targetId, suggesterName, c.body);
                              setComments((prev) => ({ ...prev, [id]: { body: '' } }));
                            }
                          }}
                        >
                          Post comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}