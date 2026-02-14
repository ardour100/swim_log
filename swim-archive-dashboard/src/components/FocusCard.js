import React from 'react';
import { motion } from 'framer-motion';
import SplitPaceChart from './SplitPaceChart';

const FocusCard = ({ session }) => {
  if (!session) {
    return (
      <div className="focus-card" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p>Select a session to view details</p>
      </div>
    );
  }

  const formatDuration = (minutes) => { // Now accepts minutes
    if (typeof minutes !== 'number') return 'N/A';
    const totalSeconds = minutes * 60;
    const mins = Math.floor(totalSeconds / 60);
    const remainingSeconds = Math.round(totalSeconds % 60);
    return `${mins}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    if (date && date.toDate) { // This part handles Firebase Timestamp
      return date.toDate().toLocaleDateString('en-US', options);
    }
    return new Date(date).toLocaleDateString('en-US', options);
  };
  
  return (
    <motion.div className="focus-card" layout>
      <motion.div className="hero-stat" layout>
        {session.distance && session.distance.qty ? (session.distance.qty / 1000).toFixed(3) : 'N/A'} km
      </motion.div>
      <div className="primary-metrics-grid">
        <div className="metric">
          <span className="metric-label">Date</span>
          <span className="metric-value">{formatDate(session.date)}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Workout Duration</span>
          <span className="metric-value">{session.workoutDuration && session.workoutDuration.qty ? formatDuration(session.workoutDuration.qty) : 'N/A'}</span>
        </div>

        <div className="metric">
          <span className="metric-label">Average Heart Rate</span>
          <span className="metric-value">
            <span role="img" aria-label="heart" style={{ marginRight: '8px' }}>❤️</span>
            {session.heartRate && session.heartRate.avg && Math.round(session.heartRate.avg.qty) || 'N/A'} bpm
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Active Calories</span>
          <span className="metric-value">{session.activeEnergyBurned && Math.round(session.activeEnergyBurned.qty) || 'N/A'} kcal</span>
        </div>
      </div>
      {session.swimDistance && session.swimDistance.length > 0 && (
        <SplitPaceChart swimDistanceData={session.swimDistance.map(item => ({ qty: item.qty, date: item.date }))} />
      )}
    </motion.div>
  );
};

export default FocusCard;
