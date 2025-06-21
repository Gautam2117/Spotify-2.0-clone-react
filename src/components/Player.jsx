import React, { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const Player = () => {
  const { currentSong, isPlaying, pauseSong, playSong } = usePlayer();
  const audioRef = useRef();
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);

  // Handle play/pause control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log(err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume, currentSong]);

  // Handle seekbar time update
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (!currentSong) return null;

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#121212] text-white p-3 flex flex-col md:flex-row items-center justify-between shadow-lg z-50">

      {/* Song Info */}
      <div className="flex items-center gap-4 w-full md:w-1/3">
        <img src={currentSong.images.coverart} alt={currentSong.title} className="w-16 h-16 rounded-lg shadow-md" />
        <div className="truncate">
          <p className="font-bold truncate">{currentSong.title}</p>
          <p className="text-sm text-gray-400 truncate">{currentSong.subtitle}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col w-full md:w-1/3 items-center">
        <button 
          onClick={() => (isPlaying ? pauseSong() : playSong(currentSong))}
          className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 transition mb-2"
        >
          {isPlaying ? <FaPause size={22} /> : <FaPlay size={22} />}
        </button>

        <div className="flex items-center gap-3 w-full">
          <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
          <input 
            type="range"
            min={0}
            max={audioRef.current?.duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-green-500"
          />
          <span className="text-xs text-gray-400">
            {formatTime(audioRef.current?.duration)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="hidden md:flex items-center gap-3 w-full md:w-1/3 justify-end">
        <button onClick={() => setVolume(volume === 0 ? 0.7 : 0)}>
          {volume === 0 ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
        </button>
        <input 
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24"
        />
      </div>

      <audio ref={audioRef} src={currentSong.hub?.actions?.[1]?.uri} autoPlay onEnded={() => pauseSong()} />
    </div>
  );
};

export default Player;
