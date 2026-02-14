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
  
  const strokeColors = {
    Freestyle: '#C5B4E3',
    Breaststroke: '#A2D2FF',
    Backstroke: '#BDE0FE',
    Butterfly: '#FFAFCC'
  }

  const strokeAnalysis = session.stroke_type ? { [session.stroke_type]: 1 } : {};


  return (
    <motion.div className="focus-card" layout>
      <motion.div className="hero-stat" layout>
        {session.distance || 'N/A'} km
      </motion.div>
      <div className="primary-metrics-grid">
        <div className="metric">
          <span className="metric-label">Date</span>
          <span className="metric-value">{formatDate(session.date)}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Workout Duration</span>
          <span className="metric-value">{formatDuration(session.duration)}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Average Pace</span>
          <span className="metric-value">{session.pace || 'N/A'} /100m</span>
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
      <div className="stroke-analysis">
        <span className="metric-label">Stroke Type Analysis</span>
        <div className="breakdown-pill">
          {Object.entries(strokeAnalysis).map(([stroke, percentage]) => (
            <div
              key={stroke}
              className="pill-segment"
              style={{
                width: `${percentage * 100}%`,
                backgroundColor: strokeColors[stroke] || '#E0E0E0',
              }}
              title={`${stroke}: ${percentage * 100}%`}
            ></div>
          ))}
        </div>
        <div className="pill-legend">
          {Object.entries(strokeAnalysis).map(([stroke, percentage]) => (
            <div key={stroke} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: strokeColors[stroke] || '#E0E0E0' }}></div>
              <span>{stroke}</span>
            </div>
          ))}
        </div>
      </div>
      {session.swimDistance && session.swimDistance.length > 0 && (
        <SplitPaceChart swimDistanceData={session.swimDistance.map(item => ({ qty: item.qty, date: item.date }))} />
      )}
    </motion.div>
  );
};

export default FocusCard;
