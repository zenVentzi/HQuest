import React, { Component } from 'react';
import NavContainer from './NavContainer';
import NavLeft from './NavLeft';
import NavRight from './NavRight';
import Search from './Search';
import NavBtn from './NavBtn';
import MenuDropdown from './MenuDropdown';

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
      <nav>
        <NavContainer>
          <NavLeft>
            <Search />
          </NavLeft>
          <NavRight>
            <NavBtn onClick={this.toggleMenu}>Menu</NavBtn>
            <MenuDropdown visible={menuVisible} />
          </NavRight>
        </NavContainer>
      </nav>
    );
  }
}

export default Navbar;
