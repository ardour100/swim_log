import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import FocusCard from './components/FocusCard';
import ProgressWall from './components/ProgressWall';
import SwimmingAnimation from './components/SwimmingAnimation';
import TotalStats from './components/TotalStats';
import mockData from './mockData.json'; // Import mock data
import AboutPage from './components/AboutPage'; // Import AboutPage
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import routing components

function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    // Use data from mockData.json
    const sessionsData = mockData.data.workouts;
    
    // Sort sessions by date in descending order (latest first)
    const sortedSessions = sessionsData.sort((a, b) => {
      // Assuming date is a string in "YYYY-MM-DD" format in mockData.json
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    setSessions(sortedSessions);
    if (sortedSessions.length > 0) {
      setActiveSession(sortedSessions[0]);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/" element={
            <>
              <ProgressWall sessions={sessions} setActiveSession={setActiveSession} />
              <SwimmingAnimation />
              <div className="main-content-container">
                <FocusCard session={activeSession} />
                <TotalStats sessions={sessions} />
              </div>
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
