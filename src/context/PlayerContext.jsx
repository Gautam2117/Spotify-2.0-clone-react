import React, { createContext, useState, useContext } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("off");  // off, all, one
  const [isFullScreen, setIsFullScreen] = useState(false);

  const playSong = (songList, index = 0) => {
    setQueue(songList);
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const playSingleSong = (song) => {
    setQueue([song]);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  const pauseSong = () => setIsPlaying(false);
  const resumeSong = () => setIsPlaying(true);

  const nextSong = () => {
    if (repeat === "one") {
      // simply restart current song
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    } else if (shuffle) {
      if (queue.length > 1) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * queue.length);
        } while (randomIndex === currentIndex);
        setCurrentIndex(randomIndex);
      }
    } else if (currentIndex < queue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (repeat === "all") {
      setCurrentIndex(0);
    } else {
      setIsPlaying(false);
    }
  };

  const prevSong = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (repeat === "all") {
      setCurrentIndex(queue.length - 1);
    }
  };

  return (
    <PlayerContext.Provider value={{
      queue,
      currentSong: queue[currentIndex],
      isPlaying,
      playSong,
      playSingleSong,
      pauseSong,
      resumeSong,
      nextSong,
      prevSong,
      currentIndex,
      setCurrentIndex,
      shuffle, setShuffle,
      repeat, setRepeat,
      isFullScreen, setIsFullScreen
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
