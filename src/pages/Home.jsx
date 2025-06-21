import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getTopCharts } from '../services/shazam';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';
import { Link } from 'react-router-dom';

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const loader = useRef(null);
  const { playSong } = usePlayer();
  const { addToLibrary } = useLibrary();

  const fetchSongs = async () => {
    setLoading(true);
    const data = await getTopCharts();
    setSongs(prev => [...prev, ...data]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSongs();
  }, [offset]);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setOffset(prev => prev + 20);
    }
  }, []);

  useEffect(() => {
    const option = { root: null, rootMargin: '20px', threshold: 1.0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-[#121212] via-[#181818] to-[#121212]">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-green-400 tracking-wide">🔥 Trending Top Charts</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {songs.map((song, index) => (
          <div 
            key={`${song.key}-${index}`} 
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
                onClick={() => playSong(songs, index)}
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

      {loading && (
        <div className="mt-10 text-center text-green-400 text-xl font-semibold animate-pulse">
          Loading more songs...
        </div>
      )}

      <div ref={loader}></div>
    </div>
  );
};

export default Home;
