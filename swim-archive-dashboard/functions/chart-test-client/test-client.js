import React from 'react';
import ReactDOM from 'react-dom/client';
import SplitPaceChart from './SplitPaceChart'; // Import your component

// Get the root element from the HTML
const rootElement = document.getElementById('root');

// Create a root and render the component
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* You can pass your actual swimDistanceData here if available */}
      <SplitPaceChart />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found to render the React app.');
}
