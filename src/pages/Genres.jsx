import React, { useState } from 'react';
import axios from 'axios';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';
import { Link } from 'react-router-dom';

// Simulated Genres
const genresList = [
  { label: 'Pop' },
  { label: 'Hip-Hop' },
  { label: 'Dance' },
  { label: 'Electronic' },
  { label: 'Rock' },
  { label: 'Country' },
  { label: 'R&B' },
  { label: 'Latin' }
];

const Genres = () => {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [songs, setSongs] = useState([]);
  const { playSingleSong } = usePlayer();  // ✅ updated here
  const { addToLibrary } = useLibrary();

  const fetchSongsByGenre = async (genre) => {
    setSelectedGenre(genre);
    try {
      const options = {
        method: 'GET',
        url: 'https://shazam-core.p.rapidapi.com/v1/search/multi',
        params: { query: `${genre} hits`, search_type: 'SONGS' },
        headers: {
          'X-RapidAPI-Key': '91aa30c0b6msh90fd43d6aaca243p185f82jsnd8e3df3607ac',
          'X-RapidAPI-Host': 'shazam-core.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      if (response.data?.tracks?.hits?.length > 0) {
        setSongs(response.data.tracks.hits.map(hit => hit.track));
      } else {
        console.warn('No songs found for genre:', genre);
        setSongs([]);
      }
    } catch (err) {
      console.error('Failed to fetch genre songs:', err);
      setSongs([]);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-[#121212] via-[#181818] to-[#121212]">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-green-400 tracking-wide">
        🎧 Explore Genres
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {genresList.map(({ label }) => (
          <button
            key={label}
            onClick={() => fetchSongsByGenre(label)}
            className={`px-6 py-3 rounded-full text-white font-semibold text-lg transition shadow-md hover:scale-110 
              ${selectedGenre === label 
                ? 'bg-gradient-to-r from-green-400 to-green-600' 
                : 'bg-[#252525] hover:bg-green-600'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {songs.length === 0 ? (
        <div className="text-center text-lg text-gray-400">
          {selectedGenre === '' ? '🎶 Select a genre to explore songs' : 'No songs found.'}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {songs.map((song) => (
            <div
              key={song.key}
              className="backdrop-blur-xl bg-gradient-to-br from-[#ffffff15] to-[#ffffff05] rounded-2xl p-5 shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer border border-[#ffffff15]"
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

              <div className="flex gap-3 mt-5">
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

export default Genres;
