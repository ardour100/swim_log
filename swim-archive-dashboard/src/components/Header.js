import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const Header = () => {
  return (
    <header className="header">
      <div className="header-left-section">
        <Link to="/" className="header-title-link"> {/* Wrap h1 with Link */}
          <h1 className="header-title">Swimming Journal</h1>
        </Link>
        <nav className="header-nav">
          <ul>
            <li><a href="/about">About</a></li>
            <li><Link to="/">Home</Link></li> {/* Change /home to / and use Link */}
          </ul>
        </nav>
      </div>
      <img src='https://cdn.dribbble.com/userupload/42160764/file/original-c007f113ea480b3f883c35bb992e44bb.gif' alt="Swimming animation" className="swimmer-gif" />
    </header>
  );
};

export default Header;
