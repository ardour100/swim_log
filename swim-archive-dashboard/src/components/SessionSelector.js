import React from 'react';
import { motion } from 'framer-motion';

const SessionSelector = ({ sessions, activeSession, setActiveSession }) => {
  return (
    <aside className="session-selector">
      <ul>
        {sessions.map((session) => (
          <motion.li
            key={session.id}
            className={activeSession && activeSession.id === session.id ? 'active' : ''}
            onClick={() => setActiveSession(session)}
            layout
          >
            <div className="session-date">
              {new Date(session.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="session-distance">{session.distance}m</div>
          </motion.li>
        ))}
      </ul>
    </aside>
  );
};

export default SessionSelector;
