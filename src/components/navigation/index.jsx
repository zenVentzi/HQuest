import React from 'react';
import NavContainer from './NavContainer';
import NavLeft from './NavLeft';
import NavRight from './NavRight';
import NavElement from './NavElement';
import Search from './Search';

const Navbar = () => (
  <nav>
    <NavContainer>
      <NavLeft>
        <Search />
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
