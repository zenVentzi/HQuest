import React, { Component } from 'react';
import MenuBtn from './MenuBtn';
import MenuDropdown from './MenuDropdown';
import NavItem from './NavItem';

class Menu extends Component {
  state = {
    showDropdown: false,
  };

  toggleMenu = () => {
    const current = this.state.showDropdown;
    this.setState({ showDropdown: !current });
  };

  render() {
    const { showDropdown } = this.state;

    return (
      <NavItem>
        <MenuBtn onClick={this.toggleMenu} />
        {showDropdown && <MenuDropdown />}
      </NavItem>
    );
  }
}

export default Menu;
