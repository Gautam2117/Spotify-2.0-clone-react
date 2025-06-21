import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { motion, AnimatePresence } from 'framer-motion';

const QueueSidebar = ({ isOpen, toggleSidebar }) => {
  const { queue, currentIndex, setCurrentIndex, isPlaying, resumeSong, pauseSong } = usePlayer();

  const handleSongClick = (index) => {
    setCurrentIndex(index);
    resumeSong();
    toggleSidebar();  // close sidebar after selecting
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 right-0 w-80 h-full bg-[#121212] text-white shadow-lg z-50 p-6"
        >
          <h2 className="text-2xl font-bold mb-4">🎶 Queue</h2>
          <div className="space-y-4 overflow-y-auto h-[80vh]">
            {queue.map((song, index) => (
              <div 
                key={`${song.key}-${index}`} 
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#1f1f1f] ${index === currentIndex ? 'bg-green-600' : 'bg-[#181818]'}`}
                onClick={() => handleSongClick(index)}
              >
                <img src={song.images.coverart} alt={song.title} className="w-12 h-12 rounded" />
                <div className="flex-1">
                  <p className="font-semibold text-sm truncate">{song.title}</p>
                  <p className="text-xs text-gray-400 truncate">{song.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={toggleSidebar} className="absolute top-3 right-3 text-white text-lg">✖</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QueueSidebar;
