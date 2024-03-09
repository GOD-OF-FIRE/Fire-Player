import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import "./MusicPlayer.css";
import { Button, Slider } from "@mui/material";
import { IconButton } from "@mui/material";
import { PlayArrow, Pause, SkipPrevious, SkipNext } from "@mui/icons-material";

const MusicPlayer = ({ songs }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageStyle, setImageStyle] = useState({
    width: "26%", // Adjust image size for non-mobile devices
    height: "auto",
    maxWidth: "50%",
  });

  const currentSong = songs[currentSongIndex];

  const playPauseHandler = () => {
    setIsPlaying(!isPlaying);
  
    const audioElement = document.querySelector("audio");
    if (isPlaying) {
      audioElement.pause(); // Pause the audio if currently playing
    } else {
      audioElement.play(); // Play the audio if currently paused
    }
  };
  
  const nextSongHandler = () => {
    const newIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(newIndex);
  
    const audioElement = document.querySelector("audio");
    audioElement.currentTime = 0; // Reset the current time to the beginning of the audio
    audioElement.play(); // Play the next song
  };

  const prevSongHandler = () => {
    const newIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(newIndex);
    // Add logic to play previous song
  };

  const seekHandler = (event, newValue) => {
    const newTime = (newValue * currentSong.duration) / 100;
    setProgress(newValue);
    const audioElement = document.querySelector("audio");
    audioElement.currentTime = newTime;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setImageStyle({
          width: "100%",
          maxWidth: "100%",
          height: "auto",
        });
      } else {
        setImageStyle({
          width: "26%",
          maxWidth: "50%",
          height: "auto",
        });
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div
        style={{
          background: "#872341",
          position: "fixed",
          bottom: "0%",
          width: "100%",
          minHeight: "8vh",
          cursor: "pointer",
        }}
        onClick={toggleDrawer}
      >
        Music Player
      </div>
      <Drawer
        anchor="bottom"
        open={isOpen}
        onClose={toggleDrawer}
        PaperProps={{ style: { borderRadius: "20px 20px 0 0" } }}
      >
        <div
          className="content"
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              width: "100%",
              height: "60vh",
              display: "flex",
              justifyContent: "cenrter",
              alignItems: "center",
            }}
          >
            <div className="image">
              <img
                src="https://assetscdn1.paytm.com/images/cinema/Fighter--705x750-0fec4d00-b782-11ee-9ee5-7d491b016e7d.jpg"
                alt="song image"
                style={imageStyle}
              />
            </div>
          </div>
          <div className="player" style={{ marginTop: "auto" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Slider
                sx={{ margin: "12px", width: "80%", color: "#fff" }} // Set color attribute to change slider color
                value={progress}
                onChange={seekHandler}
                aria-labelledby="continuous-slider"
                min={0}
                max={currentSong.duration}
              />
            </div>
            <div>
              <h2>{currentSong.title}</h2>
              <audio
                style={{ display: "none" }}
                src={currentSong.url}
                autoPlay={isPlaying}
              ></audio>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                paddingBottom: "3vh",
              }}
            >
              <IconButton
                onClick={prevSongHandler}
                style={{ backgroundColor: "#242424", color: "#fff" }}
              >
                <SkipPrevious />
              </IconButton>
              <IconButton
                onClick={playPauseHandler}
                style={{ backgroundColor: "#242424", color: "#fff" }}
              >
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
              <IconButton
                onClick={nextSongHandler}
                style={{ backgroundColor: "#242424", color: "#fff" }}
              >
                <SkipNext />
              </IconButton>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default MusicPlayer;
