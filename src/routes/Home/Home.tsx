import React from "react";
import logo from '../../logo.svg';
import {useParams} from "react-router-dom";

function Home() {

    let { jane } = useParams();
    return (
        <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React{jane}
      </a>
    </header>
    )
}

export default Home;