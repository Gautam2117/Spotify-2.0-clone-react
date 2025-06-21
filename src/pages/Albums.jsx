import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';
import { Link } from 'react-router-dom';

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const { playSingleSong } = usePlayer();   // ✅ updated here
  const { addToLibrary } = useLibrary();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const options = {
          method: 'GET',
          url: 'https://shazam-core.p.rapidapi.com/v1/search/multi',
          params: { query: 'top albums', search_type: 'SONGS' },
          headers: {
            'X-RapidAPI-Key': '91aa30c0b6msh90fd43d6aaca243p185f82jsnd8e3df3607ac',
            'X-RapidAPI-Host': 'shazam-core.p.rapidapi.com'
          }
        };

        const response = await axios.request(options);
        if (response.data?.tracks?.hits?.length > 0) {
          setAlbums(response.data.tracks.hits.map(hit => hit.track));
        } else {
          console.warn('No albums found');
          setAlbums([]);
        }
      } catch (error) {
        console.error('Failed to fetch albums:', error);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-[#121212] via-[#181818] to-[#121212]">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-green-400 tracking-wide">
        🎼 Trending Albums
      </h1>

      {albums.length === 0 ? (
        <div className="text-center text-lg text-gray-400">Loading albums...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {albums.map((album) => (
            <div
              key={album.key}
              className="backdrop-blur-xl bg-gradient-to-br from-[#ffffff15] to-[#ffffff05] rounded-2xl p-5 shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer border border-[#ffffff15]"
            >
              <Link to={`/song/${album.key}`}>
                <div className="relative group">
                  <img
                    src={album.images.coverart}
                    alt={album.title}
                    className="rounded-xl w-full h-48 object-cover transition-all group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-xl transition-all"></div>
                </div>
              </Link>

              <div className="mt-4">
                <p className="font-semibold text-lg truncate text-white">{album.title}</p>
                <p className="text-sm text-gray-400 truncate">{album.subtitle}</p>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-2 rounded-lg shadow-md hover:scale-105 transition"
                  onClick={() => playSingleSong(album)}
                >
                  ▶ Play
                </button>

                <button
                  className="flex-1 bg-gradient-to-r from-pink-400 to-pink-600 text-white font-bold py-2 rounded-lg shadow-md hover:scale-105 transition"
                  onClick={() => addToLibrary(album)}
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

export default Albums;
