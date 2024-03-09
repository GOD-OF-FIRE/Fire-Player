import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";
import "./App.css";
import MusicPlayer from "./MusicPlayer";

function App() {
  const songs = [
    { title: 'Song 1', url: '/path/to/song1.mp3', duration: 180 },
    { title: 'Song 2', url: '/path/to/song2.mp3', duration: 240 },
    // Add more songs as needed
  ];
  return (
    <>
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
      </div>
      <MusicPlayer songs={songs} />
    </>
  );
}

export default App;
