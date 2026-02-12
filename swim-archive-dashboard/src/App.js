import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import FocusCard from './components/FocusCard';
import ProgressWall from './components/ProgressWall';
import SwimmingAnimation from './components/SwimmingAnimation';
import mockData from './data/mockData.json';

function App() {
  const [activeSession, setActiveSession] = useState(mockData[0]);

  return (
    <div className="app">
      <Header />
      <ProgressWall sessions={mockData} setActiveSession={setActiveSession} />
      <SwimmingAnimation />
      <div className="main-content-container">
        <FocusCard session={activeSession} />
      </div>
    </div>
  );
}

export default App;
