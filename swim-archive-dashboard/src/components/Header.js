import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">Swimming Journal</h1>
      <img src='https://cdn.dribbble.com/userupload/42160764/file/original-c007f113ea480b3f883c35bb992e44bb.gif' alt="Swimming animation" className="swimmer-gif" />

      {/* <div className="sync-status">
        <div className="sync-indicator"></div>
        <span>Last synced with Apple Watch: 2 mins ago</span>
      </div> */}
    </header>
  );
};

export default Header;
