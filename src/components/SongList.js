function SongList({ songs, onSelect }) {
  const baseImageUrl = 'https://cms.samespace.com/assets/';
  const fallbackImage = 'https://img.freepik.com/free-photo/young-international-couple-together-park_1303-15014.jpg?size=626&ext=jpg';

  if (!Array.isArray(songs)) {
    return <div>No songs available</div>;
  }

  return (
    <ul className="song-list">
      {songs.map(song => (
        <li key={song.id} onClick={() => onSelect(song)}>
          <img 
            src={`${baseImageUrl}${song.cover}`} 
            alt={song.name} 
            onError={(e) => e.target.src = fallbackImage} 
          />
          <div className="song-details">
            <span className="song-title">{song.name}</span>
            <span className="song-artist">{song.artist}</span>
            <span className="song-duration">{song.duration || 'Unknown'}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default SongList;
