import React from 'react';

function TabSwitcher({ currentTab, setTab }) {
  return (
    <div className="tab-switcher">
      <button 
        className={currentTab === 'ForYou' ? 'active' : ''} 
        onClick={() => {
          console.log('Switching to ForYou');
          setTab('ForYou');
        }}
      >
        For You
      </button>
      <button 
        className={currentTab === 'TopTracks' ? 'active' : ''} 
        onClick={() => {
          console.log('Switching to TopTracks');
          setTab('TopTracks');
        }}
      >
        Top Tracks
      </button>
    </div>
  );
}

export default TabSwitcher;
