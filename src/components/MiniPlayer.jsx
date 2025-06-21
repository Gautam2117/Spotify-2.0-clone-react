import React, { useState, useRef, useEffect } from 'react';
import { 
  FaPlay, FaPause, FaStepBackward, FaStepForward, 
  FaVolumeUp, FaVolumeMute, FaRandom, FaRedoAlt, FaRedo, FaExpand
} from 'react-icons/fa';
import { usePlayer } from '../context/PlayerContext';

const MiniPlayer = ({ toggleQueue }) => {
  const {
    currentSong,
    isPlaying,
    queue,
    currentIndex,
    playSong,
    pauseSong,
    nextSong,
    prevSong,
    shuffle, setShuffle,
    repeat, setRepeat,
    isFullScreen, setIsFullScreen  // ✅ Added fullscreen state from context
  } = usePlayer();

  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Play / Pause effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    if (isPlaying) {
      audio.play().catch(err => console.error('Play error:', err));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong, volume]);

  // Proper listeners to update time & duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [currentSong]);

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

  const toggleRepeat = () => {
    if (repeat === "off") setRepeat("all");
    else if (repeat === "all") setRepeat("one");
    else setRepeat("off");
  };

  const handleMainPlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      if (queue.length === 0) return;
      playSong(queue, currentIndex);
    }
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] text-white p-2 flex items-center justify-between shadow-lg z-50 h-20">
      
      {/* Left: Song Info */}
      <div className="flex items-center gap-3 w-1/3 min-w-0">
        <img src={currentSong.images.coverart} alt={currentSong.title} className="w-14 h-14 rounded-md object-cover" />
        <div className="truncate">
          <p className="font-semibold text-sm truncate">{currentSong.title}</p>
          <p className="text-xs text-gray-400 truncate">{currentSong.subtitle}</p>
        </div>
      </div>

      {/* Center Controls */}
      <div className="flex flex-col items-center w-1/3 px-2">
        <div className="flex items-center gap-5 mb-1">
          <button onClick={() => setShuffle(!shuffle)} className={`${shuffle ? 'text-green-400' : 'text-white'} hover:scale-125 transition`}>
            <FaRandom size={16} />
          </button>

          <button onClick={prevSong} className="hover:scale-125 transition">
            <FaStepBackward size={16} />
          </button>

          <button onClick={handleMainPlayPause}
            className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 transition">
            {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
          </button>

          <button onClick={nextSong} className="hover:scale-125 transition">
            <FaStepForward size={16} />
          </button>

          <button onClick={toggleRepeat} className={`${repeat !== "off" ? 'text-green-400' : 'text-white'} hover:scale-125 transition`}>
            {repeat === "one" ? <FaRedoAlt size={16} /> : <FaRedo size={16} />}
          </button>
        </div>

        <div className="flex items-center gap-2 w-full">
          <span className="text-xs">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-green-500"
          />
          <span className="text-xs">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="hidden md:flex items-center gap-3 w-1/3 justify-end pr-4">
        <button onClick={toggleQueue} className="text-white hover:scale-125 transition">
          📄 Queue
        </button>
        <button onClick={() => setIsFullScreen(true)} className="text-white hover:scale-125 transition">
          <FaExpand size={16} />
        </button>
        <button onClick={() => setVolume(volume === 0 ? 0.7 : 0)}>
          {volume === 0 ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 accent-green-500"
        />
      </div>

      <audio
        ref={audioRef}
        src={currentSong.hub?.actions?.[1]?.uri}
        autoPlay
        onEnded={nextSong}
      />
    </div>
  );
};

export default MiniPlayer;
