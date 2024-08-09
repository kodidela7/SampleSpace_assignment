import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTab, setActiveTab] = useState('forYou');
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    axios.get('https://cms.samespace.com/items/songs')
      .then(response => {
        if (Array.isArray(response.data.data)) {
          setSongs(response.data.data);
          setFilteredSongs(response.data.data);
          setCurrentSong(response.data.data[0]);
        } else {
          console.error('Expected an array from the API, received:', response.data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.url;
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current.duration);
      };
      audioRef.current.ontimeupdate = () => {
        setCurrentTime(audioRef.current.currentTime);
      };
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSong]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(prevState => !prevState);
  };

  const handleNext = () => {
    setCurrentSongIndex(prevIndex => {
      const newIndex = (prevIndex + 1) % filteredSongs.length;
      setCurrentSong(filteredSongs[newIndex]);
      return newIndex;
    });
  };

  const handlePrevious = () => {
    setCurrentSongIndex(prevIndex => {
      const newIndex = (prevIndex - 1 + filteredSongs.length) % filteredSongs.length;
      setCurrentSong(filteredSongs[newIndex]);
      return newIndex;
    });
  };

  const handleSongClick = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = songs.filter(song =>
      song.name.toLowerCase().includes(searchTerm) ||
      song.artist.toLowerCase().includes(searchTerm)
    );
    setFilteredSongs(filtered);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'topTracks') {
      const topTracks = songs.filter(song => song.top_track);
      setFilteredSongs(topTracks);
    } else {
      setFilteredSongs(songs);
    }
  };

  const handleTimelineChange = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleMute = () => {
    setIsMuted(prevState => !prevState);
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Spotify_logo_horizontal_black.jpg/1920px-Spotify_logo_horizontal_black.jpg" 
          alt="Spotify Logo" 
          style={styles.logo} 
        />
      </div>
      <div style={styles.centerContent}>
        <div style={styles.tabContainer}>
          <button 
            style={{ ...styles.tab, ...(activeTab === 'forYou' ? styles.activeTab : {}) }} 
            onClick={() => handleTabChange('forYou')}
          >
            For You
          </button>
          <button 
            style={{ ...styles.tab, ...(activeTab === 'topTracks' ? styles.activeTab : {}) }} 
            onClick={() => handleTabChange('topTracks')}
          >
            Top Tracks
          </button>
        </div>
        <input 
          type="text" 
          placeholder="Search Song, Artist" 
          style={styles.searchBar} 
          onChange={handleSearch}
        />
        <div style={styles.songList}>
          {filteredSongs.map((song) => (
            <div 
              key={song.id} 
              style={styles.songItem} 
              onClick={() => handleSongClick(song)}
            >
              <img 
                src={`https://cms.samespace.com/assets/${song.cover}`} 
                alt={song.name} 
                style={styles.songCover} 
                onError={(e) => e.target.src = 'https://img.freepik.com/free-photo/young-international-couple-together-park_1303-15014.jpg?size=626&ext=jpg'}
              />
              <div>
                <div style={styles.songName}>{song.name}</div>
                <div style={styles.songArtist}>{song.artist}</div>
              </div>
              <div style={styles.songDuration}>{song.duration}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={styles.rightContent}>
        {currentSong && (
          <>
            <div style={styles.songDetails}>
              <h1 style={styles.songTitle}>{currentSong.name}</h1>
              <h2 style={styles.songArtist}>{currentSong.artist}</h2>
            </div>
            <img 
              src={`https://cms.samespace.com/assets/${currentSong.cover}`} 
              alt={currentSong.name} 
              style={styles.largeCoverImage} 
              onError={(e) => e.target.src = 'https://img.freepik.com/free-photo/young-international-couple-together-park_1303-15014.jpg?size=626&ext=jpg'}
            />
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleTimelineChange}
              style={styles.timeline}
            />
            <audio ref={audioRef} />
            <div style={styles.controls}>
              <button style={styles.controlButton} onClick={handlePrevious}>
                <FontAwesomeIcon icon={faBackward} size='2x' />
              </button>
              <button style={styles.controlButton} onClick={handlePlayPause}>
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size='2x' />
              </button>
              <button style={styles.controlButton} onClick={handleNext}>
                <FontAwesomeIcon icon={faForward} size='2x' />
              </button>
              <button style={styles.controlButton1} onClick={handleMute}>
                <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} size='2x' />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: 'black',
    color: '#fff',
    margin: "10px"
  },
  sidebar: {
    width: '20%',
    padding: '20px',
    boxSizing: 'border-box',
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'start',
  },
  logo: {
    width: '150px',
    
  },
  centerContent: {
    width: '32%',
    padding: '20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  tabContainer: {
    display: 'flex',
    marginBottom: '20px',
    width: "100%"
  },
  tab: {
    padding: '10px',
    color: '#b3b3b3',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flex: 1,
    textAlign: 'left',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  activeTab: {
    color: '#fff',
    borderBottom: '2px solid white',
  },
  searchBar: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    marginBottom: '20px',
    backgroundColor: '#333',
    color: '#fff',
    width: '100%',
    maxWidth: '600px',
  },
  songList: {
    flex: 1,
    overflowY: 'auto',
    width: '100%',
    maxWidth: '600px',
  },
  songItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0',
    cursor: 'pointer',
  },
  songCover: {
    width: '50px',
    height: '50px',
    marginRight: '15px',
    borderRadius: '5px',
  },
  songName: {
    fontSize: '16px',
    marginBottom: '5px',
  },
  songArtist: {
    fontSize: '14px',
    color: '#b3b3b3',
  },
  songDuration: {
    marginLeft: 'auto',
    fontSize: '14px',
    color: '#b3b3b3',
  },
  rightContent: {
    width: '45%',
    padding: '20px',
    boxSizing: 'border-box',
    backgroundColor: 'black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  songDetails: {
    textAlign: 'start',
    marginBottom: '20px',
    marginTop: "40px",
    fontWeight: "bolder"
  },
  songTitle: {
    fontSize: '35px',
    marginBottom: '10px',
    display: "flex",
    paddingRight: "300px",
    fontFamily: "italic"
  },
  songArtist: {
    fontSize: '15px',
    color: '#b3b3b3',
  },
  largeCoverImage: {
    width: '400px',
    height: '400px',
    marginBottom: '20px',
    borderRadius: '10px',
    objectFit: 'cover',
  },
  timeline: {
    width: '70%',
    marginTop: '3px',
    appearance: 'none',
    backgroundColor: '#b3b3b3',
    height: '4px',
    borderRadius: '2px',
    outline: 'none',
    cursor: 'pointer',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    paddingLeft:"100px"
  },
  controlButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: "white",
    display:"flex",
    justifyContent:'centre'
  },
  controlButton1: {
    backgroundColor: 'transparent',
    color: "white",
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    paddingLeft:'40px'
  },
};

export default App;
