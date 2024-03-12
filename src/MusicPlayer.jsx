import React, { useEffect, useRef, useState } from "react";
import Drawer from "@mui/material/Drawer";
import "./MusicPlayer.css";
import { Slider, IconButton, Typography } from "@mui/material";
import { PlayArrow, Pause, SkipPrevious, SkipNext } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { VolumeDown, VolumeUp } from "@mui/icons-material";

const MusicPlayer = ({ songs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5); 
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const audioRef = useRef(null);
  const [imageStyle, setImageStyle] = useState({
    width: "26%", 
    height: "auto",
    maxWidth: "50%",
    borderRadius: "20px",
    boxShadow: "0 0 10px black",
  });
  const [imgStyle, setImgStyle] = useState({
    width: "40%", 
    height: "auto",
    maxWidth: "40%",
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
    setProgress(0);
    setIsPlaying(true); 
  };

  const prevSongHandler = () => {
    const newIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(newIndex);
    setProgress(0); 
    setIsPlaying(true); 
  };

  const seekHandler = (event, newValue) => {
    setProgress(newValue);
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
    }
  };

  const volumeChangeHandler = (event, newValue) => {
    const newVolume = parseFloat(newValue.toFixed(2)); 
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
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
        if (currentTime >= duration - 0.1) {
          nextSongHandler();
        }
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setWindowWidth(window.innerWidth);
        setImageStyle({
          width: "100%",
          maxWidth: "100%",
          height: "auto",
          borderRadius: "20px",
          boxShadow: "0 0 10px black",
        });
        setImgStyle({
          width: "110%",
          maxWidth: "110%",
          height: "auto",
        });
      } else if (window.innerWidth <= 1000) {
        setWindowWidth(window.innerWidth);
        setImageStyle({
          width: "50%",
          maxWidth: "100%",
          height: "auto",
          borderRadius: "20px",
          boxShadow: "0 0 10px black",
        });
        setImgStyle({
          width: "100%",
          maxWidth: "100%",
          height: "auto",
        });
      } else {
        setWindowWidth(window.innerWidth);
        setImageStyle({
          width: "26%",
          maxWidth: "50%",
          height: "auto",
          borderRadius: "20px",
          boxShadow: "0 0 10px black",
        });
        setImgStyle({
          width: "40%",
          maxWidth: "40%",
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
    setProgress(0);
  }, [currentSongIndex]);

  useEffect(() => {
    setDuration(audioRef?.current?.duration);
  }, [currentSongIndex]);

  function convertSecond(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    return (
      minutes.toString().padStart(2, "0") +
      ":" +
      remainingSeconds.toFixed(2).padStart(5, "0")
    );
  }

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
          display: "flex",
          gap: "12px",
        }}
        onClick={toggleDrawer}
      >
        <div style={{ width: "10%" }}>
          <img
            src={songs[currentSongIndex].image}
            alt="song image"
            style={imgStyle}
          />
        </div>
        <div style={{ width: "90%" }}>
          <Typography>Song: {songs[currentSongIndex].name}</Typography>
          <Typography>Artist: {songs[currentSongIndex].artist}</Typography>
        </div>
      </div>
      <Drawer
        anchor="bottom"
        open={isOpen}
        onClose={toggleDrawer}
        PaperProps={{ style: { borderRadius: "20px 20px 0 0" } }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "0px",
            padding: "0px",
            cursor: "pointer",
          }}
          onClick={toggleDrawer}
        >
          <IconButton sx={{ margin: "0px", padding: "0px" }}>
            <ArrowDropDownIcon sx={{ fontSize: "40px" }} />
          </IconButton>
        </div>
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
                max={duration} 
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                gap: "5rem",
              }}
            >
              <Typography variant="caption" sx={{ color: "#fff" }}>
                {convertSecond(progress)}
              </Typography>
              <Typography variant="caption" sx={{ color: "#fff" }}>
                {convertSecond(duration)}
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" sx={{ color: "#fff" }}>
                {songs[currentSongIndex].name}
              </Typography>
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
            {windowWidth > 600 && (
              <div
                className="volume"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "-5rem",
                  paddingRight: "1rem",
                  alignItems: "center",
                }}
              >
                <VolumeDown sx={{ color: "#fff" }} />
                <Slider
                  sx={{ margin: "12px", width: "7rem", color: "#fff" }}
                  value={volume}
                  onChange={volumeChangeHandler}
                  aria-labelledby="continuous-slider"
                  min={0}
                  max={1}
                  step={0.01}
                />
                <VolumeUp sx={{ color: "#fff" }} />
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default MusicPlayer;
