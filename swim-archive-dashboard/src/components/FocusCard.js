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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
  };

  return (
    <motion.div className="focus-card" layout>
      <motion.div className="hero-stat" layout>
        {session.distance || 'N/A'}m
      </motion.div>
      <div className="apple-watch-metrics">
        <div className="metric">
          <span className="metric-label">Duration</span>
          <span className="metric-value">{formatDuration(session.duration) || 'N/A'}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Date</span>
          <span className="metric-value">{new Date(session.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) || 'N/A'}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default FocusCard;
