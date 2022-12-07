import React from 'react';
import { useParams } from 'react-router-dom';

import logo from '../../logo.svg';

function Home() {
  const { jane } = useParams();
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
        Learn React{jane}
      </a>
    </header>
  );
}

export default Home;
