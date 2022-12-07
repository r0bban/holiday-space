import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './routes/Home';
import ChristmasHome from './routes/christmasSpace/ChristmasHome';
import Participant from './routes/christmasSpace/Participant';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="christmas/game">
          <Route path=":gameId" element={<ChristmasHome />} />
          <Route path=":gameId/:participantId" element={<Participant />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
