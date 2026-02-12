import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import SessionSelector from './components/SessionSelector';
import FocusCard from './components/FocusCard';
import ProgressWall from './components/ProgressWall';
import SwimmingAnimation from './components/SwimmingAnimation';
import mockData from './data/mockData.json';

function App() {
  const [activeSession, setActiveSession] = useState(mockData[0]);

  return (
    <div className="app">
      <Header />
      <ProgressWall sessions={mockData} />
      <SwimmingAnimation />
      <div className="main-content-container">
        <FocusCard session={activeSession} />
        <SessionSelector
          sessions={mockData}
          activeSession={activeSession}
          setActiveSession={setActiveSession}
        />
      </div>
    </div>
  );
}

export default App;
