import React, { Component, Fragment } from 'react';
import { getLoggedUserId } from 'Utils';
import NavContainer from './NavContainer';
import NavLeft from './NavLeft';
import NavRight from './NavRight';
import Search from './Search';
import Menu from './Menu';
import Notifications from './Notifications';
import Profile from './Profile';
import NewsfeedBtn from './NewsfeedBtn';

// TODO check if user is logged in

const Navbar = () => {
  const isUserLogged = !!getLoggedUserId();
  return (
    <NavContainer>
      <NavLeft>{isUserLogged && <Search />}</NavLeft>
      <NavRight>
        {isUserLogged && (
          <Fragment>
            <NewsfeedBtn />
            <Profile />
            <Notifications />
            <Menu />
          </Fragment>
        )}
      </NavRight>
    </NavContainer>
  );
};

export default Navbar;
