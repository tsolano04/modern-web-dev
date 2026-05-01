import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Parse from "parse";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { LASTFM_CONFIG } from "../../Services/LastFm/config";

const Navbar = ({ setFlag }) => {
  const navigate = useNavigate();
  const currentUser = Parse.User.current();
  const { theme, toggleTheme } = useTheme();

  const [lastFmProfile, setLastFmProfile] = useState(null);

  const fetchLastFmInfo = async (username) => {
    try {
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${LASTFM_CONFIG.API_KEY}&format=json`
      );
      const data = await response.json();
      if (data.user) setLastFmProfile(data.user);
    } catch (error) {
      console.error("Last.fm fetch error:", error);
    }
  };

  useEffect(() => {
    const syncUser = async () => {
      const user = Parse.User.current();
      if (user) {
        try {
          await user.fetch();
          const lastfmName = user.get("lastfmUsername");
          if (lastfmName) {
            fetchLastFmInfo(lastfmName);
          } else {
            setLastFmProfile(null);
          }
        } catch (e) {
          console.error("Sync error", e);
        }
      } else {
        setLastFmProfile(null);
      }
    };
    syncUser();
  }, [setFlag]);

  const handleConnectLastFm = async (disconnect) => {
    if (disconnect) {
      try {
        const user = Parse.User.current();
        user.unset("lastfmUsername");
        user.unset("lastfmSessionKey");
        await user.save();
        setLastFmProfile(null);
        alert("Last.fm account disconnected!");
      } catch (error) {
        alert("Error disconnecting: " + error.message);
      }
      return;
    }
    const CALLBACK_URL = "https://modern-web-oj8vkcpde-tsolano04s-projects.vercel.app/";
    window.location.href = `https://www.last.fm/api/auth/?api_key=${LASTFM_CONFIG.API_KEY}&cb=${CALLBACK_URL}`;
  };

  const logout = () => {
    Parse.User.logOut()
      .then(() => {
        setFlag(false);
        setLastFmProfile(null);
        alert("You successfully logged out!");
        navigate("/login");
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  };

  return (
    <aside className="w-56 min-h-screen flex flex-col bg-sidebar border-r border-sidebar-border shrink-0">
      <div className="px-5 py-4 border-b border-sidebar-border">
        <span className="font-semibold text-sidebar-foreground tracking-tight">
          Music Share
        </span>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          <li>
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              Home
            </Link>
          </li>
          {currentUser && (
            <>
              <li>
                <Link
                  to="/addSong"
                  className="block px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  Add Song
                </Link>
              </li>
              <li>
                <Link
                  to="/pieChart"
                  className="block px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  Pie Chart
                </Link>
              </li>
              <li>
                <Link
                  to="/leagues"
                  className="block px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  Leagues
                </Link>
              </li>
              <li>
                <Link
                  to="/web"
                  className="block px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  Web
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border space-y-3">
        {currentUser ? (
          <>
            <div className="flex items-center justify-between px-1">
              <span className="text-sm text-sidebar-foreground truncate">
                {currentUser.get("firstName")}
              </span>
              <button
                onClick={logout}
                className="text-xs text-destructive hover:underline shrink-0"
              >
                Logout
              </button>
            </div>

            {/* Last.fm section */}
            <div className="px-1">
              {lastFmProfile ? (
                <div className="flex items-center gap-2">
                  {lastFmProfile.image?.[1]?.["#text"] ? (
                    <img
                      src={lastFmProfile.image[1]["#text"]}
                      alt="Last.fm avatar"
                      className="w-6 h-6 rounded-full shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-muted shrink-0" />
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-sidebar-foreground font-medium truncate">
                      {lastFmProfile.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {lastFmProfile.playcount} plays
                    </span>
                  </div>
                  <button
                    onClick={() => handleConnectLastFm(true)}
                    className="text-xs text-destructive hover:underline shrink-0 ml-auto"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnectLastFm(false)}
                  className="w-full text-xs py-1.5 rounded-md border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                >
                  Connect Last.fm
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className="flex-1 text-center text-xs py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="flex-1 text-center text-xs py-1.5 rounded-md border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              Register
            </Link>
          </div>
        )}

        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
