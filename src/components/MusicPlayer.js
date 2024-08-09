

import React, { useRef, useEffect, useState } from 'react';
import Controls from './Controls';

function MusicPlayer({ song, onNextSong, onPreviousSong }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = song.url;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      setIsPlaying(true);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
  }, [song]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    onNextSong();  
  };

  const handlePrevious = () => {
    onPreviousSong(); 
  };

  const backgroundStyle = {
    background: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${song.cover}) no-repeat center center`,
    backgroundSize: 'cover',
  };

  return (
    <div className="music-player" style={backgroundStyle}>
      <audio ref={audioRef} />
      <div className="song-info">
        <h2>{song.name}</h2>
        <h3>{song.artist}</h3>
      </div>
      <Controls 
        onPlayPause={handlePlayPause} 
        onNext={handleNext} 
        onPrevious={handlePrevious} 
      />
    </div>
  );
}

export default MusicPlayer;