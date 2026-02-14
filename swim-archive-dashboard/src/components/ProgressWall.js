import React, { useState, useEffect } from 'react';

const ProgressWall = ({ sessions, setActiveSession }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const year = 2026;

  // Helper to convert session date
  const getSessionDate = (session) => {
    if (session.date && session.date.toDate) {
      return session.date.toDate();
    }
    return new Date(session.date);
  };

  // Determine which sessions to display
  const sessionsToDisplay = isMobile
    ? sessions.filter(s => getSessionDate(s).getMonth() === new Date(Math.max(...sessions.map(s => getSessionDate(s)))).getMonth())
    : sessions;
  
  const displayMonth = isMobile ? new Date(Math.max(...sessions.map(s => getSessionDate(s)))).getMonth() : null;
  const displayYear = isMobile ? new Date(Math.max(...sessions.map(s => getSessionDate(s)))).getFullYear() : year;

  const startDate = new Date(displayYear, isMobile ? displayMonth : 0, 1);
  const startDayOfWeek = startDate.getDay();
  const firstDayGridOffset = (startDayOfWeek === 0) ? 6 : startDayOfWeek - 1;

  const daysInMonth = new Date(displayYear, (displayMonth || 0) + 1, 0).getDate();
  const totalGridCells = isMobile ? daysInMonth + firstDayGridOffset : 365 + firstDayGridOffset;

  const swimsByDay = sessionsToDisplay.reduce((acc, session) => {
    const sessionDate = getSessionDate(session);
    const day = isMobile ? sessionDate.getDate() : Math.ceil((sessionDate - new Date(sessionDate.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24));
    acc[day] = (acc[day] || 0) + session.distance;
    return acc;
  }, {});

  const maxDistance = Math.max(1, ...Object.values(swimsByDay));
  
  const days = Array.from({ length: totalGridCells }, (_, i) => {
    if (i < firstDayGridOffset) {
      return <div key={`empty-${i}`} className="day-circle-empty"></div>;
    }

    const dayIndex = i - firstDayGridOffset + 1;
    const distance = swimsByDay[dayIndex] || 0;
    
    let opacity = 0.3; // Default for no swim
    if (distance > 0) {
      const intensity = Math.min(distance / maxDistance, 1);
      opacity = 0.4 + intensity * 0.6; // Scale from 0.4 to 1.0
    }

    const style = {
      backgroundColor: `var(--accents-data)`,
      opacity: opacity,
      cursor: distance > 0 ? 'pointer' : 'default',
    };

    const handleClick = () => {
      if (distance > 0) {
        const sessionDate = new Date(displayYear, displayMonth, dayIndex);
        const session = sessions.find(s => {
          const sDate = getSessionDate(s);
          return sDate.getFullYear() === displayYear &&
                 sDate.getMonth() === sessionDate.getMonth() &&
                 sDate.getDate() === sessionDate.getDate();
        });
        if (session) {
          setActiveSession(session);
        }
      }
    };

    return <div key={dayIndex} className="day-circle" style={style} onClick={handleClick} title={`${new Date(displayYear, displayMonth, dayIndex).toLocaleDateString()}: ${Math.round(distance)}m`}></div>;
  });

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthLabelPositions = monthLabels.map((month, index) => {
    const firstDayOfMonth = new Date(year, index, 1);
    const dayOfYear = Math.ceil((firstDayOfMonth - new Date(year, 0, 1)) / (1000 * 60 * 60 * 24));
    const gridColumnStart = Math.floor((dayOfYear + firstDayGridOffset) / 7) + 1;
    return { month, gridColumnStart };
  });

  return (
    <div className="progress-wall">
      <h3>Commitment Wall ({isMobile ? monthLabels[displayMonth] : year})</h3>
      {!isMobile && (
        <div className="month-labels-container">
          {monthLabelPositions.map(({ month, gridColumnStart }) => (
            <div key={month} className="month-label" style={{ gridColumnStart }}>
              {month}
            </div>
          ))}
        </div>
      )}
      <div className={`swim-wall ${isMobile ? 'mobile' : ''}`}>{days}</div>
<br/>
      <div className="sync-status">
      <div className="sync-indicator"></div>
      <span>Last synced with Apple Watch: within 1 day</span>
      </div>
    </div>
  );
};

export default ProgressWall;
