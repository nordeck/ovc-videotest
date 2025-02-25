import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          ovc-frontend
        </p>
        <p>
          NODE_ENV {process.env.NODE_ENV}
        </p>
        <p>
          version {process.env.REACT_APP_VERSION}
        </p>
        <a
          className="App-link"
          href="/config/config.js"
          target="_blank"
          rel="noopener noreferrer"
        >
          config
        </a>
      </header>
    </div>
  );
}

export default App;
