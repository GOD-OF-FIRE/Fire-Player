import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import MusicPlayer from './MusicPlayer';

const App = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylistTracks = async () => {
      try {
        // Fetch access token
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa('9fc5288c28a0491fb086f42851d2eb0d' + ':' + '22bcc8225db34d77825647c7d566742b')
          },
          body: 'grant_type=client_credentials'
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to fetch access token');
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Fetch tracks from the playlist
        const response = await fetch('https://api.spotify.com/v1/playlists/37i9dQZF1DX4ghkRUdIogy/tracks', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch playlist tracks');
        }

        const data = await response.json();
        
        // Filter tracks with preview URLs
        const filteredTracks = data.items.filter(item => item.track.preview_url !== null);
        
        // Map the filtered tracks to required format
        const formattedTracks = filteredTracks.map(item => ({
          name: item.track.name,
          artist: item.track.artists.map(artist => artist.name).join(', '),
          image: item.track.album.images[0].url,
          song:item.track.preview_url
        }));
        
        setTracks(formattedTracks);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPlaylistTracks();
  }, []);

  return (
    <div className="App">
      <AppBar
        position="static"
        sx={{ backgroundColor: "#22092C" }}
      >
        <Toolbar>
          <Typography variant="h6" align="center" style={{ width: "100%" }}>
            FIRE PLAYER
          </Typography>
        </Toolbar>
      </AppBar>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <MusicPlayer songs={tracks} />
      )}
    </div>
  );
};

export default App;
