import React from 'react';
import { useLibrary } from '../context/LibraryContext.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { Link } from 'react-router-dom';

const Library = () => {
  const { library, removeFromLibrary } = useLibrary();
  const { playSingleSong } = usePlayer();  // ✅ updated here

  if (library.length === 0) {
    return (
      <div className="p-10 text-center text-gray-400 text-2xl">
        📂 Your Library is empty.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-green-400">🎶 My Library</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {library.map((song) => (
          <div key={song.key} className="bg-gradient-to-br from-[#121212] to-[#1f1f1f] rounded-xl p-3 shadow-lg">
            <Link to={`/song/${song.key}`}>
              <img 
                src={song.images.coverart} 
                alt={song.title} 
                className="rounded-xl w-full h-48 object-cover hover:opacity-80 transition" 
              />
            </Link>

            <div className="mt-3">
              <p className="font-semibold text-lg truncate">{song.title}</p>
              <p className="text-sm text-gray-400 truncate">{song.subtitle}</p>
            </div>

            <button 
              className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
              onClick={() => playSingleSong(song)}
            >
              ▶ Play
            </button>

            <button 
              className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
              onClick={() => removeFromLibrary(song.key)}
            >
              ❌ Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
