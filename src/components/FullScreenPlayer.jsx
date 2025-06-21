import React, { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const FullScreenPlayer = ({ onClose }) => {
  const { currentSong, isPlaying, pauseSong, playSong, nextSong, prevSong } = usePlayer();
  const audioRef = useRef();
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log(err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong, volume]);

  useEffect(() => {
    const updateTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
    };
    const interval = setInterval(updateTime, 500);
    return () => clearInterval(interval);
  }, []);

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  if (!currentSong) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90 text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center blur-lg opacity-30" 
        style={{ backgroundImage: `url(${currentSong.images.coverart})` }}
      />

      <div className="relative z-10 w-80 md:w-96">
        <button onClick={onClose} className="absolute top-3 right-3 text-2xl text-gray-300 hover:text-white">
          <IoClose />
        </button>

        <img src={currentSong.images.coverart} alt={currentSong.title} className="rounded-2xl shadow-xl" />

        <div className="mt-6 text-center">
          <h2 className="text-3xl font-bold">{currentSong.title}</h2>
          <p className="text-lg text-gray-300">{currentSong.subtitle}</p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-sm">{formatTime(currentTime)}</span>
            <input 
              type="range" 
              min={0} 
              max={duration} 
              value={currentTime} 
              onChange={handleSeek}
              className="w-full accent-green-500"
            />
            <span className="text-sm">{formatTime(duration)}</span>
          </div>

          <div className="flex justify-center items-center gap-5 mt-4">
            <button onClick={prevSong} className="hover:scale-125 transition">
              <FaStepBackward size={28} />
            </button>

            <button 
              onClick={() => (isPlaying ? pauseSong() : playSong(currentSong))}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 transition"
            >
              {isPlaying ? <FaPause size={32} /> : <FaPlay size={32} />}
            </button>

            <button onClick={nextSong} className="hover:scale-125 transition">
              <FaStepForward size={28} />
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <button onClick={() => setVolume(volume === 0 ? 0.7 : 0)}>
              {volume === 0 ? <FaVolumeMute size={22} /> : <FaVolumeUp size={22} />}
            </button>
            <input 
              type="range" 
              min={0} 
              max={1} 
              step={0.01} 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-40 accent-green-500"
            />
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={currentSong.hub?.actions?.[1]?.uri} autoPlay onEnded={() => nextSong()} />
    </div>
  );
};

export default FullScreenPlayer;
