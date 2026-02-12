import React from 'react';
import { motion } from 'framer-motion';

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
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const strokeColors = {
    Freestyle: '#C5B4E3',
    Breaststroke: '#A2D2FF',
    Backstroke: '#BDE0FE',
    Butterfly: '#FFAFCC'
  }


  return (
    <motion.div className="focus-card" layout>
      <motion.div className="hero-stat" layout>
        {session.distance || 'N/A'}m
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
          <span className="metric-value">{session.pace} /100m</span>
        </div>
        <div className="metric">
          <span className="metric-label">Average Heart Rate</span>
          <span className="metric-value">
            <span role="img" aria-label="heart" style={{ marginRight: '8px' }}>❤️</span>
            {session.avgHeartRate} bpm
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Active Calories</span>
          <span className="metric-value">{session.activeCalories} kcal</span>
        </div>
      </div>
      <div className="stroke-analysis">
        <span className="metric-label">Stroke Type Analysis</span>
        <div className="breakdown-pill">
          {Object.entries(session.strokeAnalysis).map(([stroke, percentage]) => (
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
          {Object.entries(session.strokeAnalysis).map(([stroke, percentage]) => (
            <div key={stroke} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: strokeColors[stroke] || '#E0E0E0' }}></div>
              <span>{stroke}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FocusCard;
