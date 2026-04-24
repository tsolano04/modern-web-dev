import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Parse from "parse";
import { LASTFM_CONFIG } from "../../Services/LastFm/config";

const Navbar = ({ setFlag }) => {
    const navigate = useNavigate();
    const currentUser = Parse.User.current();
    
    // State for Last.fm data
    const [lastFmProfile, setLastFmProfile] = useState(null);
    const [lastFmInput, setLastFmInput] = useState("");

    // Fetch Last.fm info from the API
    const fetchLastFmInfo = async (username) => {; 
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
                
                // 1. Remove the fields from Parse
                user.unset("lastfmUsername");
                user.unset("lastfmSessionKey");
                
                // 2. Save the changes to the database
                await user.save();
                
                // 3. Update local state so the UI changes immediately
                setLastFmProfile(null);
                
                alert("Last.fm account disconnected!");
            } catch (error) {
                alert("Error disconnecting: " + error.message);
            }
            return;
        }
        const CALLBACK_URL = "http://localhost:5173/lastfm-callback"; 
        
        window.location.href = `http://www.last.fm/api/auth/?api_key=${LASTFM_CONFIG.API_KEY}&cb=${CALLBACK_URL}`;
    };

    const logout = () => {
        Parse.User.logOut()
            .then(() => {
                setFlag(false);
                setLastFmProfile(null); // Clear local Last.fm state
                alert("You successfully logged out!");
                navigate("/login"); 
            })
            .catch((error) => {
                alert(`Error: ${error.message}`);
            });
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#eee' }}>
            {!currentUser && (
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                </ul>
            )}

            {currentUser && (
                <>
                    <div>
                        <h1>Hello, {currentUser.get("firstName")}</h1>
                        
                        {/* --- LAST.FM INTEGRATION SECTION --- */}
                        <div style={{ marginTop: "10px", borderTop: "1px solid #ccc", paddingTop: "5px" }}>
                            {lastFmProfile ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {lastFmProfile.image[1]['#text'] ? (
                                        <img 
                                            src={lastFmProfile.image[1]['#text']} 
                                            alt="avatar" 
                                            style={{ borderRadius: '50%', width: '30px' }} 
                                        />
                                    ) : (
                                        <div style={{ width: '30px', height: '30px', background: '#ccc', borderRadius: '50%' }} />
                                    )}
                                    <span>Last.fm: <strong>{lastFmProfile.name}</strong> ({lastFmProfile.playcount} plays)</span>
                                    <button onClick={() => handleConnectLastFm(true)} style={{ marginLeft: '10px' }}>Disconnect</button>
                                </div>
                            ) : (
                                <div>
                                    <button onClick={() => handleConnectLastFm(false)}>Connect Last.fm</button>
                                </div>
                            )}
                        </div>
                        {/* ----------------------------------- */}
                    </div>

                    <ul>
                        <li><button onClick={logout}>Logout</button></li>
                    </ul>
                </>
            )}
        </nav>
    );
};

export default Navbar;