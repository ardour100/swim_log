import React from 'react';

const TotalStats = ({ sessions }) => {
  const totalDistance = sessions.reduce((acc, session) => acc + session.distance, 0);
  const totalDuration = sessions.reduce((acc, session) => acc + session.duration, 0);
  const totalDays = sessions.length;

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  
  const calculateAveragePace = () => {
    if (totalDistance === 0) return "0'00\"";
    
    const avgPaceTotalSecondsPer100m = (totalDuration / totalDistance) * 100;
    const avgPaceMinutes = Math.floor(avgPaceTotalSecondsPer100m / 60);
    const avgPaceSeconds = Math.round(avgPaceTotalSecondsPer100m % 60);

    return `${avgPaceMinutes}'${avgPaceSeconds.toString().padStart(2, '0')}"`;
  };


  return (
    <div className="total-stats">
      <div className="total-stat-item">
        <span className="stat-value">{totalDistance / 1000}km</span>
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
      <div className="total-stat-item">
        <span className="stat-value">{calculateAveragePace()}</span>
        <span className="stat-label">avg pace</span>
      </div>
    </div>
  );
};

export default TotalStats;
