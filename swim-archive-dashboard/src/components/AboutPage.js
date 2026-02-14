import React from 'react';

const AboutPage = () => {
  return (
    <div className="about-page">
      <h2>About This Project</h2>
      <p>
        This is a simple swimming journal dashboard designed to visualize and track swimming activities.
        It integrates data to display key metrics like total distance, workout duration,
        heart rate, and calorie burn.
      </p>
      <p>
        The project aims to provide a clear and engaging overview of swimming performance,
        helping users monitor their progress over time.
      </p>
      <h3>Data Sources</h3>
      <p>
        Currently, the dashboard uses static mock data. In a full implementation, this data would
        typically be sourced from health tracking devices (e.g., Apple Watch) and managed via a backend
        service like Firebase.
      </p>
      <h3>Technology Stack</h3>
      <ul>
        <li>React.js for the frontend user interface.</li>
        <li>Firebase for backend services (authentication, database - currently commented out).</li>
        <li>CSS for styling and animations.</li>
      </ul>
      <p>
        Feel free to explore the different sections of the dashboard to see your swimming stats!
      </p>
    </div>
  );
};

export default AboutPage;
