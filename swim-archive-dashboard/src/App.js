import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import FocusCard from './components/FocusCard';
import ProgressWall from './components/ProgressWall';
import SwimmingAnimation from './components/SwimmingAnimation';
import TotalStats from './components/TotalStats';
import { db } from './firebase'; // Re-import Firebase
import { collection, onSnapshot } from 'firebase/firestore'; // Re-import Firebase
import AboutPage from './components/AboutPage'; // Keep AboutPage import
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Keep routing components

function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "swims"), (querySnapshot) => {
      const sessionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort sessions by date in descending order (latest first)
      const sortedSessions = sessionsData.sort((a, b) => {
        const dateA = a.date && a.date.seconds ? a.date.seconds : 0;
        const dateB = b.date && b.date.seconds ? b.date.seconds : 0;
        return dateB - dateA;
      });

      setSessions(sortedSessions);
      if (sortedSessions.length > 0) {
        setActiveSession(sortedSessions[0]);
      }
    });

    return () => unsubscribe(); // Correct cleanup function placement
  }, []); // Empty dependency array means this effect runs once on mount

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
