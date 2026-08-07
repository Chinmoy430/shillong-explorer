// ============================================================
// main.jsx — React Application Entry Point
// ============================================================
//
// 📚 REACT CONCEPT: ReactDOM.createRoot()
// This is where React "mounts" onto the HTML page.
// It finds the <div id="root"> in index.html and replaces its
// content with the entire React application tree.
//
// React.StrictMode:
//   Wrapping in <StrictMode> activates extra warnings in development.
//   It intentionally renders components twice (in dev only) to help
//   find bugs like missing cleanup functions in useEffect.
//   It has NO effect on the production build.
//
// CSS Import Order:
//   1. index.css   — Google Fonts + global resets (must be first)
//   2. main.css    — All public site component styles
//   3. auth.css    — Auth page styles
//   4. admin.css   — Admin panel styles
// ============================================================

import React       from 'react';
import ReactDOM    from 'react-dom/client';
import App         from './App.jsx';

// CSS loaded in order — all styles are globally available
import './styles/index.css';
import './styles/main.css';
import './styles/auth.css';
import './styles/admin.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
