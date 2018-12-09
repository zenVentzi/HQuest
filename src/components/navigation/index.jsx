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

class Navbar extends Component {
  state = { isHidden: false };

  componentDidMount() {
    window.addEventListener('scroll', this.hideBar);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.hideBar);
  }

  hideBar = () => {
    const { isHidden } = this.state;

    // eslint-disable-next-line no-unused-expressions
    window.scrollY > this.prev
      ? !isHidden && this.setState({ isHidden: true })
      : isHidden && this.setState({ isHidden: false });

    this.prev = window.scrollY;
  };
  render() {
    const isUserLogged = !!getLoggedUserId();
    const { isHidden } = this.state;

    return isHidden ? null : (
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
  }
}

export default Navbar;
