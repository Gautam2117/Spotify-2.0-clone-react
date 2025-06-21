import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { usePlayer } from '../context/PlayerContext.jsx';

const SongDetails = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const { playSong } = usePlayer();

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const response = await axios.request({
          method: 'GET',
          url: `https://shazam-core.p.rapidapi.com/v1/tracks/details`,
          params: { track_id: id },
          headers: {
            'X-RapidAPI-Key': '91aa30c0b6msh90fd43d6aaca243p185f82jsnd8e3df3607ac',
            'X-RapidAPI-Host': 'shazam-core.p.rapidapi.com'
          }
        });

        setSong(response.data);
      } catch (error) {
        console.error('Error fetching song details:', error);
      }
    };

    fetchSongDetails();
  }, [id]);

  if (!song) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#111111] to-[#1f1f1f]">
        <div className="text-xl text-gray-400">Loading song details...</div>
      </div>
    );
  }

  return (
    <div className="p-10 min-h-screen bg-gradient-to-b from-[#111111] via-[#181818] to-[#111111] text-white">
      <div className="flex flex-col md:flex-row gap-14 items-center justify-center">
        <div className="relative group">
          <img 
            src={song.images.coverart} 
            alt={song.title} 
            className="w-72 h-72 rounded-2xl shadow-2xl border border-[#ffffff20]"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-xl transition-all"></div>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-5xl font-extrabold mb-4 text-center md:text-left">{song.title}</h1>
          <p className="text-xl text-gray-400 mb-6 text-center md:text-left">{song.subtitle}</p>
          <span className="text-sm font-semibold bg-green-500 px-4 py-2 rounded-full mb-6">
            {song.genres?.primary || 'Unknown Genre'}
          </span>

          <button 
            onClick={() => playSingleSong(album)} 
            className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-600 rounded-xl text-white font-bold shadow-lg hover:scale-110 transition"
          >
            ▶ Play Song
          </button>
        </div>
      </div>

      <div className="mt-16 max-w-3xl mx-auto">
        <h3 className="font-bold text-3xl mb-6 text-center">Lyrics</h3>
        <div className="whitespace-pre-wrap text-lg text-gray-300 bg-[#181818] p-6 rounded-2xl shadow-lg border border-[#ffffff20]">
          {song.sections?.[1]?.text?.length > 0 
            ? song.sections[1].text.join('\n') 
            : 'Lyrics not available for this song.'}
        </div>
      </div>
    </div>
  );
};

export default SongDetails;
