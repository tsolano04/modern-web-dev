import React, { useState, useEffect } from 'react';
import WebGraph from './WebChild';
import { fetchParseData } from '../../Services/parseServices/parseService';
import { LASTFM_CONFIG } from '../../Services/LastFm/config';
import Parse from "parse";

const fetchLastFmData = async (username, dataType) => {
  try {
    const response = await fetch(
      `${LASTFM_CONFIG.BASE_URL}?method=user.get${dataType}&user=${username}&api_key=${LASTFM_CONFIG.API_KEY}&format=json&limit=40`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${dataType} for ${username}:`, error);
    return null;
  }
};

const extractItems = (data, type) => {
  if (!data) return [];
  switch (type) {
    case 'tracks':
      return data.recenttracks?.track || [];
    case 'artists':
      return data.topartists?.artist || [];
    case 'albums':
      return data.topalbums?.album || [];
    default:
      return [];
  }
};

export default function WebParent() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [connectionType, setConnectionType] = useState('tracks'); // tracks, artists, albums

  useEffect(() => {
    const fetchUserConnections = async () => {
      setLoading(true);
      try {
        const currentUser = Parse.User.current();
        
        if (!currentUser) {
          setGraphData({ nodes: [], links: [] });
          setLoading(false);
          return;
        }

        // Fetch the leagues relation for current user
        const leaguesRelation = currentUser.relation("leagues");
        const leagueObjects = await leaguesRelation.query().find();
        
        if (leagueObjects.length === 0) {
          setGraphData({ nodes: [], links: [] });
          setLoading(false);
          return;
        }

        // Collect all users from all leagues
        const leagueUsersSet = new Set();
        const leagueUsersData = [];
        
        for (const league of leagueObjects) {
          const membersRelation = league.relation("members");
          const memberObjects = await membersRelation.query().find();
          
          for (const member of memberObjects) {
            if (!leagueUsersSet.has(member.id)) {
              leagueUsersSet.add(member.id);
              leagueUsersData.push({
                objectId: member.id,
                lastfmUsername: member.get("lastfmUsername"),
                firstName: member.get("firstName"),
                lastName: member.get("lastName")
              });
            }
          }
        }

        // Filter to users with Last.fm usernames
        const usersWithLastFm = leagueUsersData.filter(user => user.lastfmUsername);
        
        if (usersWithLastFm.length === 0) {
          setGraphData({ nodes: [], links: [] });
          setLoading(false);
          return;
        }

        // Fetch Last.fm data for each user
        const userDataPromises = usersWithLastFm.map(async (user) => {
          const lastfmUsername = user.lastfmUsername;
          
          // Fetch based on connection type
          let dataType;
          switch (connectionType) {
            case 'tracks':
              dataType = 'recenttracks';
              break;
            case 'artists':
              dataType = 'topartists';
              break;
            case 'albums':
              dataType = 'topalbums';
              break;
            default:
              dataType = 'recenttracks';
          }
          
          const data = await fetchLastFmData(lastfmUsername, dataType);
          const items = extractItems(data, connectionType);

          return {
            ...user,
            lastfmData: items,
            lastfmUsername
          };
        });

        const usersWithData = await Promise.all(userDataPromises);
        
        // Create nodes for each user with Last.fm
        const nodes = usersWithData.map(user => {
          const isCurrentUser = currentUser && user.objectId === currentUser.id;
          return {
            id: user.objectId,
            name: user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}` 
              : user.lastfmUsername,
            lastfmUsername: user.lastfmUsername,
            avatar: user.lastfmImage?.[2]?.['#text'] || null,
            lastfmData: user.lastfmData || [],
            isCurrentUser
          };
        });

        // Create links based on shared listening data
        const links = [];
        
        // Compare each pair of users to find connections
        for (let i = 0; i < usersWithData.length; i++) {
          for (let j = i + 1; j < usersWithData.length; j++) {
            const userA = usersWithData[i];
            const userB = usersWithData[j];
            
            if (!userA.lastfmData || !userB.lastfmData) continue;
            
            // Find common items based on connection type
            let commonItems = [];
            
            switch (connectionType) {
              case 'tracks':
                // Match by artist + track name
                commonItems = userA.lastfmData.filter(trackA => 
                  userB.lastfmData.some(trackB => 
                    trackB.artist?.['#text'] === trackA.artist?.['#text'] &&
                    trackB.name === trackA.name
                  )
                ).map(track => ({
                  name: track.name,
                  artist: track.artist?.['#text']
                }));
                break;
                
              case 'artists':
                // Match by artist name
                commonItems = userA.lastfmData.filter(artistA => 
                  userB.lastfmData.some(artistB => 
                    artistB.name === artistA.name
                  )
                ).map(artist => ({ name: artist.name }));
                break;
                
              case 'albums':
                // Match by album + artist
                commonItems = userA.lastfmData.filter(albumA => 
                  userB.lastfmData.some(albumB => 
                    albumB.name === albumA.name &&
                    albumB.artist?.['#text'] === albumA.artist?.['#text']
                  )
                ).map(album => ({
                  name: album.name,
                  artist: album.artist?.['#text']
                }));
                break;
                
              default:
                commonItems = [];
            }
            
            // Create a link if there are common items
            if (commonItems.length > 0) {
              
              links.push({
                source: userA.objectId,
                target: userB.objectId,
                type: connectionType,
                items: commonItems.slice(0, 3), // Show up to 3 connecting items
                strength: Math.min(commonItems.length / 5, 1)
              });
            }
          }
        }

        setGraphData({ nodes, links });
      } catch (error) {
        console.error("Error fetching user connections:", error);
        setGraphData({ nodes: [], links: [] });
      }
      setLoading(false);
    };

    fetchUserConnections();
  }, [connectionType]);

  return (
    <div className="webParent space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Music Web</h1>
          <p className="text-muted-foreground text-sm">
            Discover users with similar music tastes
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setConnectionType('tracks')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              connectionType === 'tracks'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Songs
          </button>
          <button
            onClick={() => setConnectionType('artists')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              connectionType === 'artists'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Artists
          </button>
          <button
            onClick={() => setConnectionType('albums')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              connectionType === 'albums'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Albums
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading connections...</div>
        </div>
      ) : graphData.nodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-muted-foreground">No league members found</p>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Join a league to see connections with other members based on shared music tastes.
            All league members with connected Last.fm accounts will appear here.
          </p>
        </div>
      ) : (
        <WebGraph data={graphData} connectionType={connectionType} />
      )}
    </div>
  );
}