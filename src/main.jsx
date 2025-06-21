import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PlayerProvider } from './context/PlayerContext.jsx';
import { LibraryProvider } from './context/LibraryContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <LibraryProvider>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </LibraryProvider>
);
