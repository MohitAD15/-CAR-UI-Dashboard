// App.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import CarScene from './CarScene';  // The 3D scene

function App() {
  // Toggles for help panel, seat panel, music panel
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [showSeatPanel, setShowSeatPanel] = useState(false);
  const [showMusicPanel, setShowMusicPanel] = useState(false);

  // State for current date-time and temperature
  const [currentDateTime, setCurrentDateTime] = useState(new Date().toLocaleString());
  const [temperature, setTemperature] = useState('Loading...');

  // Music state
  const musicTracks = [
    { name: 'SoundHelix Song 1', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { name: 'SoundHelix Song 2', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { name: 'SoundHelix Song 3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { name: 'SoundHelix Song 4', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { name: 'SoundHelix Song 5', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
    { name: 'SoundHelix Song 6', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  ];

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(musicTracks[currentTrackIndex].url));

  // Update current date-time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const apiKey = '6a3e637501b657139998f0183d5e5e1b';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Frankfurt&units=metric&appid=${apiKey}`);
        const data = await response.json();
        const currentTemp = Math.round(data.main.temp);
        setTemperature(`Frankfurt, ${currentTemp}°C`);
      } catch (error) {
        console.error("Error fetching temperature:", error);
        setTemperature("Frankfurt, N/A");
      }
    };

    fetchTemperature();
  }, []);

  // Music controls
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % musicTracks.length;
    setCurrentTrackIndex(nextIndex);
    audioRef.current.src = musicTracks[nextIndex].url;
    if (isPlaying) audioRef.current.play();
  };

  const prevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + musicTracks.length) % musicTracks.length;
    setCurrentTrackIndex(prevIndex);
    audioRef.current.src = musicTracks[prevIndex].url;
    if (isPlaying) audioRef.current.play();
  };
  const adjustBrightness = (change) => {
    let currentBrightness = parseFloat(document.body.style.filter.replace("brightness(", "").replace(")", "")) || 1;
    let newBrightness = Math.min(Math.max(currentBrightness + change, 0.3), 1.5); // Prevents too much brightness change
    document.body.style.filter = `brightness(${newBrightness})`;
  };

  // Toggle panels
  const handleMusicClick = () => setShowMusicPanel(!showMusicPanel);
  const handleSpotifyClick = () => window.open('https://www.spotify.com/', '_blank');
  const handleYouTubeClick = () => window.open('https://www.youtube.com/', '_blank');
  const handleMapsClick = () => window.open('https://maps.google.com', '_blank');
  const handleHelpClick = () => setShowHelpPanel(!showHelpPanel);
  const handleSeatClick = () => setShowSeatPanel(!showSeatPanel);

  return (
    <div className="car-ui-container">
      {/* 3D Scene in the background */}
      <div className="scene-wrapper">
        <CarScene />
      </div>

      {/* Foreground UI */}
      <div className="ui-overlay">
        {/* Top Bar */}
        <div className="top-bar">
          {/* Left Arrow - Now Visible */}
          <div className="nav-button left-arrow">
            <img
              src="https://cdn-icons-png.flaticon.com/512/271/271220.png"
              alt="Left Arrow"
            />
          </div>
          <span className="temp-display">{temperature}</span>

          {/* Center - Date & Time */}
          <div className="time-container">
            <span className="date-time-display">
              {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString()}
            </span>
          </div>

          {/* Right Arrow - Fully Visible */}
          <div className="nav-button right-arrow">
            <img
              src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
              alt="Right Arrow"
            />
          </div>
        </div>

        {/* Car Image */}
        <div className="car-image-container">
          <img src="/textures/car-image.png" alt="Car" className="car-image" />
        </div>

        {/* Middle Content */}
        <div className="content-wrap">
          {/* Steering Wheel Section */}
          <div className="speed-section">
            <div className="steering-wheel-container">
              <img
                src="/textures/steering-wheel.png"
                alt="Steering Wheel"
                className="steering-wheel"
              />
              {/* <span className="speed-indicator">12 mph</span> */}
            </div>
          </div>

          {/* Icon Grid */}
          <div className="icon-grid">
            <div className="round-icon" onClick={handleSpotifyClick}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                alt="Spotify"
              />
              <span>Spotify</span>
            </div>
            <div className="round-icon" onClick={handleYouTubeClick}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"
                alt="YouTube"
              />
              <span>YouTube</span>
            </div>
            <div className="round-icon" onClick={handleMapsClick}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
                alt="Map"
              />
              <span>Maps</span>
            </div>
            <div className="round-icon" onClick={() => window.open('https://poki.com/', '_blank')}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/1012/1012336.png"
                alt="Game"
              />
              <span>Games</span>
            </div>
            <div className="round-icon" onClick={handleSeatClick}>
              <img src="/icons/seat-adjust.png" alt="Seat Adjust" />
              <span>Seats</span>
            </div>
            <div className="round-icon" onClick={handleMusicClick}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/727/727245.png"
                alt="Music"
              />
              <span>Music</span>
            </div>
            <div
              className="round-icon"
              onClick={() => window.open('https://www.google.com', '_blank')}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                alt="Globe"
              />
              <span>Browser</span>
            </div>

            <div className="round-icon" onClick={handleHelpClick}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/128/128318.png"
                alt="Help Icon"
              />
              <span>Help</span>
            </div>
          </div>
        </div>

        {/* HELP PANEL */}
        {showHelpPanel && (
          <div className="help-panel">
            <button className="close-button" onClick={handleHelpClick}>
              &times;
            </button>
            <h3>Help & Assistance</h3>
            <div className="help-actions">
              <div className="help-item">
                <h4>Emergency Call / SOS</h4>
                <p>Call or message for urgent assistance if needed.</p>
                <button className="help-button">Emergency Call</button>
                <button className="help-button">SOS</button>
              </div>
              <div className="help-item">
                <h4>Vehicle Diagnostic</h4>
                <p>Quick scan: engine oil level, tire pressure, next service, etc.</p>
                <button className="help-button">Run Diagnostic</button>
              </div>
              <div className="help-item">
                <h4>Manual & FAQ</h4>
                <p>View the vehicle’s user manual or search for troubleshooting tips.</p>
                <button className="help-button">Open Manual</button>
                <button className="help-button">Search FAQ</button>
              </div>
            </div>
          </div>
        )}

        {/* SEAT PANEL */}
        {showSeatPanel && (
          <div className="seat-panel">
            <button className="close-button" onClick={handleSeatClick}>
              &times;
            </button>
            <h3>Adjust Seat Position</h3>
            <p>Use these controls to move or tilt your seat:</p>
            <div className="seat-controls">
              <button className="seat-button">Forward</button>
              <button className="seat-button">Backward</button>
              <button className="seat-button">Up</button>
              <button className="seat-button">Down</button>
              <button className="seat-button">Tilt Forward</button>
              <button className="seat-button">Tilt Backward</button>
            </div>
          </div>
        )}

        {/* MUSIC PANEL */}
        {showMusicPanel && (
          <div className="music-panel">
            <button className="close-button" onClick={handleMusicClick}>
              &times;
            </button>
            <h3>Music Player</h3>
            <div className="music-controls">
              <button onClick={prevTrack}>&#9664; Back</button>
              <button onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
              <button onClick={nextTrack}>Next &#9654;</button>
            </div>
            <p>Now Playing: {musicTracks[currentTrackIndex].name}</p>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="bottom-bar">
          <div className="nav-button battery-icon">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3103/3103446.png"
              alt="Battery Full"
            />
          </div>

          {/* <div className="nav-button">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1946/1946488.png"
              alt="Home"
            />
          </div> */}
          {/* Google Assistant - Center-Aligned */}
          <div className="assistant-wrapper">
            <div className="mic-wrapper" onClick={() => window.open('https://assistant.google.com/', '_blank')}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/2534/2534185.png"
                alt="Microphone"
              />
              <span>Google Assistant</span>
            </div>
          </div>


          <div className="bottom-brightness">
            <div className="brightness-controls">
              <button className="brightness-btn" onClick={() => adjustBrightness(-0.1)}>
                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828906.png" alt="Brightness Down" />
              </button>
              <div className="brightness-indicator">🔆</div>
              <button className="brightness-btn" onClick={() => adjustBrightness(0.1)}>
                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828926.png" alt="Brightness Up" />
              </button>
            </div>
          </div>



          {/* <div className="speedometer-icon">
            <span>12 mph</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
