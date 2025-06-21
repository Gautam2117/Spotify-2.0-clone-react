import React, { createContext, useState, useContext } from 'react';

const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState([]);

  const addToLibrary = (song) => {
    if (!library.find(item => item.key === song.key)) {
      setLibrary(prev => [...prev, song]);
    }
  };

  const removeFromLibrary = (songKey) => {
    setLibrary(prev => prev.filter(item => item.key !== songKey));
  };

  return (
    <LibraryContext.Provider value={{ library, addToLibrary, removeFromLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);
