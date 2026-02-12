import React from 'react';

const ProgressWall = ({ sessions, setActiveSession }) => {
  const year = 2026;
  const startDate = new Date(year, 0, 1);
  const startDayOfWeek = startDate.getDay(); // 0 (Sun) - 6 (Sat)
  
  // In JS, Sunday is 0. We want to treat Monday as the start of the week.
  // Let's adjust so Monday is 0 and Sunday is 6.
  const firstDayGridOffset = (startDayOfWeek === 0) ? 6 : startDayOfWeek -1;


  const totalGridCells = 365 + firstDayGridOffset;

  const swimsByDay = sessions.reduce((acc, session) => {
    const sessionDate = new Date(session.date);
    if (sessionDate.getFullYear() === year) {
      const startOfYear = new Date(year, 0, 1);
      const dayOfYear = Math.ceil((sessionDate - startOfYear) / (1000 * 60 * 60 * 24));
      acc[dayOfYear] = (acc[dayOfYear] || 0) + session.distance;
    }
    return acc;
  }, {});

  const maxDistance = Math.max(1, ...Object.values(swimsByDay));
  
  const days = Array.from({ length: totalGridCells }, (_, i) => {
    if (i < firstDayGridOffset) {
      return <div key={`empty-${i}`} className="day-circle-empty"></div>;
    }

    const dayOfYear = i - firstDayGridOffset + 1;
    const distance = swimsByDay[dayOfYear] || 0;
    
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
        const sessionDate = new Date(year, 0, dayOfYear);
        const session = sessions.find(s => {
          const sDate = new Date(s.date);
          return sDate.getFullYear() === year &&
                 sDate.getMonth() === sessionDate.getMonth() &&
                 sDate.getDate() === sessionDate.getDate();
        });
        if (session) {
          setActiveSession(session);
        }
      }
    };

    return <div key={dayOfYear} className="day-circle" style={style} onClick={handleClick} title={`${new Date(year, 0, dayOfYear).toLocaleDateString()}: ${distance}m`}></div>;
  });

  const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const monthLabelPositions = monthLabels.map((month, index) => {
    const firstDayOfMonth = new Date(year, index, 1);
    const dayOfYear = Math.ceil((firstDayOfMonth - startDate) / (1000 * 60 * 60 * 24));
    const gridColumnStart = Math.floor((dayOfYear + firstDayGridOffset) / 7) + 1;
    return { month, gridColumnStart };
  });

  return (
    <div className="progress-wall">
      <h3>Commitment Wall ({year})</h3>
      <div className="month-labels-container">
        {monthLabelPositions.map(({ month, gridColumnStart }) => (
          <div key={month} className="month-label" style={{ gridColumnStart }}>
            {month}
          </div>
        ))}
      </div>
      <div className="swim-wall">{days}</div>
    </div>
  );
};

export default ProgressWall;
