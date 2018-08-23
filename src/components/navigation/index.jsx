import React from 'react';
import NavContainer from './NavContainer';
import NavLeft from './NavLeft';
import NavRight from './NavRight';
import Search from './Search';
import Menu from './Menu';
import Notifications from './Notifications';
import ProfileBtn from './ProfileBtn';
import HomeBtn from './HomeBtn';

const Navbar = () => (
  <NavContainer>
    <NavLeft>
      <Search />
    </NavLeft>
    <NavRight>
      <HomeBtn />
      <ProfileBtn />
      <Notifications />
      <Menu />
    </NavRight>
  </NavContainer>
);

export default Navbar;
