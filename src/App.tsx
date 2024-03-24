import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ChristmasHome from './routes/christmasSpace/ChristmasHome';
import Participant from './routes/christmasSpace/Participant';
import NetSalary from './routes/salary';

import Home from './routes/Home';
import './App.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/se';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'se'}>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="christmas/game">
            <Route path=":gameId" element={<ChristmasHome />} />
            <Route path=":gameId/:participantId" element={<Participant />} />
          </Route>
          <Route path="salary/" element={<NetSalary />} />
        </Routes>
      </div>
    </LocalizationProvider>
  );
}

export default App;
