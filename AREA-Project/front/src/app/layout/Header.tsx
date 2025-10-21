import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h1>AREA</h1>
        </div>
        <nav className="header-nav">{/* Navigation items will go here */}</nav>
      </div>
    </header>
  );
};

export default Header;
