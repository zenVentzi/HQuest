import React from 'react';
import NavContainer from './NavContainer';
import NavLeft from './NavLeft';
import NavRight from './NavRight';
import NavElement from './NavElement';
// import style from './css/navbar.css';

const Navbar = () => (
  <nav>
    <NavContainer>
      <NavLeft>
        <NavElement>
          Home
        </NavElement>
      </NavLeft>
      <NavRight>
        <NavElement>
          About
        </NavElement>
      </NavRight>
    </NavContainer>
  </nav>
);

export default Navbar;
