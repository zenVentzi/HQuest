import React from 'react';
import NavbarRight from './NavbarRight';
import style from './css/navbar.css';

const Navbar = () => (
  <nav>
    <div className="nav-container">
      <div className="topnav">
        <a href="/">Home</a>
      </div>
      <NavbarRight />
    </div>
  </nav>
);

export default Navbar;
