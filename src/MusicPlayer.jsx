import React, { useEffect, useRef, useState } from "react";
import Drawer from "@mui/material/Drawer";
import "./MusicPlayer.css";
import { Slider, IconButton } from "@mui/material";
import { PlayArrow, Pause, SkipPrevious, SkipNext } from "@mui/icons-material";

const MusicPlayer = ({ songs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const [imageStyle, setImageStyle] = useState({
    width: "26%", // Adjust image size for non-mobile devices
    height: "auto",
    maxWidth: "50%",
  });

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const playPauseHandler = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSongHandler = () => {
    const newIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(newIndex);
    setProgress(0); // Reset progress when changing songs
    setIsPlaying(true); // Start playing next song automatically
  };

  const prevSongHandler = () => {
    const newIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(newIndex);
    setProgress(0); // Reset progress when changing songs
    setIsPlaying(true); // Start playing previous song automatically
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      if (isPlaying) {
        audioElement.play();
      } else {
        audioElement.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        const currentTime = audioRef.current.currentTime;
        setProgress(currentTime);
      }
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [duration]);
  const seekHandler = (event, newValue) => {
    console.log("newValue", newValue);
    setProgress(newValue);
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
    }
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setImageStyle({
          width: "100%",
          maxWidth: "100%",
          height: "auto",
        });
      } else if (window.innerWidth <= 1000) {
        setImageStyle({
          width: "50%",
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

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      const interval = setInterval(() => {
        if (audioRef.current) {
          const currentTime = audioRef.current.currentTime;
          setProgress(currentTime);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration]);

  useEffect(() => {
    // When a new song is selected, set the progress to 0
    setProgress(0);
  }, [currentSongIndex]);

  useEffect(() => {
    // When a new song is selected, update the duration of the song
    setDuration(audioRef?.current?.duration);
  }, [currentSongIndex]);
  console.log("duraion", audioRef.current?.duration);
  console.log("duraionState", duration);
  console.log("currenttime", audioRef.current?.currentTime);
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
          padding: "8px",
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
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <div
            className="background"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
              backgroundImage: `url(${songs[currentSongIndex].image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(10px)",
            }}
          />
          <div
            style={{
              width: "100%",
              height: "60vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <div
              className="image"
              style={{ display: "flex", justifyContent: "center", zIndex: 12 }}
            >
              <img
                src={songs[currentSongIndex].image}
                alt="song image"
                style={imageStyle}
              />
            </div>
          </div>
          <div className="player" style={{ marginTop: "auto", zIndex: 15 }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Slider
                sx={{ margin: "12px", width: "80%", color: "#fff" }}
                value={progress}
                onChange={seekHandler}
                aria-labelledby="continuous-slider"
                min={0}
                max={duration} // Set max value to duration
              />
            </div>
            <div>
              <h2>{songs[currentSongIndex].name}</h2>
              <audio
                ref={audioRef}
                src={songs[currentSongIndex].song}
                autoPlay={isPlaying}
                onLoadedMetadata={() => setDuration(audioRef.current.duration)}
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
