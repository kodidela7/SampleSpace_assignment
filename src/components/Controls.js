import React from 'react';

function Controls({ onPlayPause, onNext, onPrevious }) {
  return (
    <div className="controls">
      <button onClick={onPrevious} className="previous">Previous</button>
      <button onClick={onPlayPause} className="play-pause">Play/Pause</button>
      <button onClick={onNext} className="next">Next</button>
    </div>
  );
}

export default Controls;
