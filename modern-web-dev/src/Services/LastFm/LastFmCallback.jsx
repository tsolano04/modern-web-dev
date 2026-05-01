import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Parse from "parse";
import md5 from "md5";
import { LASTFM_CONFIG } from "../../Services/LastFm/config";

const LastFmCallback = ({ setFlag }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            exchangeTokenForSession(token);
        }
    }, [searchParams]);

    const exchangeTokenForSession = async (token) => {
        console.log("token:", token);
        
        // 1. Create the API Signature (Required by Last.fm for Auth)
        const sig = md5(`api_key${LASTFM_CONFIG.API_KEY}methodauth.getSessiontoken${token}${LASTFM_CONFIG.SHARED_KEY}`);
        console.log("Generated API Signature:", sig);
        
        // 2. Call auth.getSession
        const url = `https://ws.audioscrobbler.com/2.0/?method=auth.getSession&token=${token}&api_key=${LASTFM_CONFIG.API_KEY}&api_sig=${sig}&format=json`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
        
            if (data.session) {
                const currentUser = Parse.User.current();
                currentUser.set("lastfmUsername", data.session.name);
                currentUser.set("lastfmSessionKey", data.session.key);
                await currentUser.save();
                await currentUser.fetch(); 

                if (setFlag) {
                    setFlag(true);
                }   
                // Redirect back to where user was before Last.fm auth
                const returnUrl = sessionStorage.getItem("lastfmReturnUrl");
                sessionStorage.removeItem("lastfmReturnUrl");
                window.location.href = returnUrl || "https://modern-web-oj8vkcpde-tsolano04s-projects.vercel.app/";
            }
        } catch (error) {
            console.error("Failed to connect to Last.fm:", error);
            const returnUrl = sessionStorage.getItem("lastfmReturnUrl");
            sessionStorage.removeItem("lastfmReturnUrl");
            window.location.href = returnUrl || "https://modern-web-oj8vkcpde-tsolano04s-projects.vercel.app/";
        }
    };

    return <div>Connecting to Last.fm... please wait.</div>;
};

export default LastFmCallback;