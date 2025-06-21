import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import SongDetails from './pages/SongDetails';
import Albums from './pages/Albums';
import Genres from './pages/Genres';
import MiniPlayer from './components/MiniPlayer';
import Navbar from './components/Navbar';
import { PlayerProvider } from './context/PlayerContext.jsx';
import Library from './pages/Library';
import FullScreenPlayer from './components/FullScreenPlayer';

const App = () => {
  return (
    <PlayerProvider>
      <Router>
        <div className="flex bg-[#121212] text-white min-h-screen">
          
          {/* Sidebar */}
          <Navbar />

          {/* Main Content */}
          <div className="ml-0 md:ml-64 flex-1 p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/genres" element={<Genres />} />
              <Route path="/library" element={<Library />} />
              <Route path="/song/:id" element={<SongDetails />} />
            </Routes>
          </div>

          <MiniPlayer />
          <FullScreenPlayer />
        </div>
      </Router>
    </PlayerProvider>
  );
};

export default App;
