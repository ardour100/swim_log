import React from 'react';

const TotalStats = ({ sessions }) => {
  const totalDistance = sessions.reduce((acc, session) => acc + session.distance, 0);
  const totalDuration = sessions.reduce((acc, session) => acc + session.duration, 0);
  const totalDays = sessions.length;

  console.log("totalDuration", totalDuration);
  console.log("totalDistance", totalDistance);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  
  return (
    <div className="total-stats">
      <div className="total-stat-item">
        <span className="stat-value">{(Math.round((totalDistance) * 10) / 10).toFixed(1)} km</span>
        <span className="stat-label">in total</span>
      </div>
      <div className="total-stat-item">
        <span className="stat-value">{formatDuration(totalDuration)}</span>
        <span className="stat-label">time</span>
      </div>
      <div className="total-stat-item">
        <span className="stat-value">{totalDays}</span>
        <span className="stat-label">days</span>
      </div>
    </div>
  );
};

export default TotalStats;
