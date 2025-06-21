import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSearch, FaCompactDisc, FaTags, FaHeart } from 'react-icons/fa';

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'flex items-center gap-4 text-white bg-gradient-to-r from-green-500 to-green-600 px-5 py-3 rounded-xl shadow-lg transition-all'
      : 'flex items-center gap-4 text-gray-300 hover:text-white hover:bg-[#282828] px-5 py-3 rounded-xl transition-all';

  return (
    <div className="bg-[#121212] backdrop-blur-md border-r border-[#ffffff15] w-full md:w-64 min-h-screen p-6 fixed top-0 left-0 z-50">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 drop-shadow-lg">
          🎵 Gautify
        </h1>
        <p className="text-sm text-gray-400 mt-2 tracking-wide">Your Music Hub</p>
      </div>

      <nav className="flex flex-col gap-4">
        <NavLink to="/" className={linkClass}>
          <FaHome size={20} /> Home
        </NavLink>
        <NavLink to="/search" className={linkClass}>
          <FaSearch size={20} /> Search
        </NavLink>
        <NavLink to="/albums" className={linkClass}>
          <FaCompactDisc size={20} /> Albums
        </NavLink>
        <NavLink to="/genres" className={linkClass}>
          <FaTags size={20} /> Genres
        </NavLink>
        <NavLink to="/library" className={linkClass}>
          <FaHeart size={20} /> Library
        </NavLink>
      </nav>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-70">
        © 2025 Gautify
      </div>
    </div>
  );
};

export default Navbar;
