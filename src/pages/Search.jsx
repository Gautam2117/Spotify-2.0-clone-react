import React, { useState, useEffect } from 'react';
import { searchSongs, getTopCharts } from '../services/shazam';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';
import { Link } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { playSingleSong } = usePlayer();   // <-- updated here
  const { addToLibrary } = useLibrary();

  // Load trending by default
  useEffect(() => {
    const loadTrending = async () => {
      const trending = await getTopCharts();
      setResults(trending);
    };
    loadTrending();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    const data = await searchSongs(query);
    setResults(data);
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-[#121212] via-[#181818] to-[#121212]">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-green-400 tracking-wide">
        🔍 Search for Music
      </h1>

      <form 
        onSubmit={handleSearch} 
        className="flex justify-center items-center gap-2 mb-12"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter song or artist..."
          className="w-2/3 md:w-1/3 p-4 rounded-lg bg-[#1f1f1f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
        />
        <button 
          type="submit" 
          className="bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
        >
          Search
        </button>
      </form>

      {results.length === 0 ? (
        <div className="text-center text-lg text-gray-400">No songs found. Try searching something else.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {results.map((song) => (
            <div 
              key={song.key} 
              className="backdrop-blur-xl bg-gradient-to-br from-[#ffffff15] to-[#ffffff05] rounded-2xl p-4 shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer border border-[#ffffff15]"
            >
              <Link to={`/song/${song.key}`}>
                <div className="relative group">
                  <img 
                    src={song.images.coverart} 
                    alt={song.title} 
                    className="rounded-xl w-full h-48 object-cover transition-all group-hover:opacity-80" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-xl transition-all"></div>
                </div>
              </Link>

              <div className="mt-4">
                <p className="font-semibold text-lg truncate text-white">{song.title}</p>
                <p className="text-sm text-gray-400 truncate">{song.subtitle}</p>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-2 rounded-lg shadow-md hover:scale-105 transition"
                  onClick={() => playSingleSong(song)}
                >
                  ▶ Play
                </button>

                <button 
                  className="flex-1 bg-gradient-to-r from-pink-400 to-pink-600 text-white font-bold py-2 rounded-lg shadow-md hover:scale-105 transition"
                  onClick={() => addToLibrary(song)}
                >
                  ❤️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
