import React, { Component } from 'react';
import NavContainer from './NavContainer';
import NavLeft from './NavLeft';
import NavRight from './NavRight';
import Search from './Search';
import MenuBtn from './MenuBtn';
import NotificationsBtn from './NotificationsBtn';
import MenuDropdown from './MenuDropdown';
import ProfileBtn from './ProfileBtn';
import HomeBtn from './HomeBtn';

class Navbar extends Component {
  state = {
    menuVisible: false,
  };

  toggleMenu = () => {
    const current = this.state.menuVisible;
    this.setState({ menuVisible: !current });
  };

  render() {
    const { menuVisible } = this.state;

    return (
      <NavContainer>
        <NavLeft>
          <Search />
        </NavLeft>
        <NavRight>
          <HomeBtn />
          <ProfileBtn />
          <NotificationsBtn />
          <MenuBtn onClick={this.toggleMenu} />
          <MenuDropdown visible={menuVisible} />
        </NavRight>
      </NavContainer>
    );
  }
}

export default Navbar;
