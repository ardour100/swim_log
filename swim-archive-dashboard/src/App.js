import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import FocusCard from './components/FocusCard';
import ProgressWall from './components/ProgressWall';
import SwimmingAnimation from './components/SwimmingAnimation';
import TotalStats from './components/TotalStats';
import { db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';

function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "swims"), (querySnapshot) => {
      const sessionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSessions(sessionsData);
      if (sessionsData.length > 0) {
        setActiveSession(sessionsData[0]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="app">
      <Header />
      <ProgressWall sessions={sessions} setActiveSession={setActiveSession} />
      <SwimmingAnimation />
      <div className="main-content-container">
        <FocusCard session={activeSession} />
        <TotalStats sessions={sessions} />
      </div>
    </div>
  );
}

export default App;
