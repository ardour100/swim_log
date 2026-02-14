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

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    if (date && date.toDate) {
      return date.toDate().toLocaleDateString('en-US', options);
    }
    return new Date(date).toLocaleDateString('en-US', options);
  };
  
  return (
    <motion.div className="focus-card" layout>
      <motion.div className="hero-stat" layout>
        {(session.distance *1000).toFixed(0) || 'N/A'} m
      </motion.div>
      <div className="primary-metrics-grid">
        <div className="metric">
          <span className="metric-label">Date</span>
          <span className="metric-value">{formatDate(session.date)}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Workout Duration</span>
          <span className="metric-value">{formatDuration(session.duration)} min</span>
        </div>
        <div className="metric">
          <span className="metric-label">Average Heart Rate</span>
          <span className="metric-value">
            <span role="img" aria-label="heart" style={{ marginRight: '8px' }}>❤️</span>
            {Math.round(session.avg_hr) || 'N/A'} bpm
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Active Calories</span>
          <span className="metric-value">{Math.round(session.active_kcal) || 'N/A'} kcal</span>
        </div>
      </div>
      {session.swimDistance && session.swimDistance.length > 0 && (
        <SplitPaceChart swimDistanceData={session.swimDistance.map(item => ({ qty: item.qty, date: item.date }))} />
      )}
    </motion.div>
  );
};

export default FocusCard;
