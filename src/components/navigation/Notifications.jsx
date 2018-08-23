import React, { Component } from 'react';
import NotifBtn from './NotifBtn';
import NotifDropdown from './NotifDropdown';
import NavItem from './NavItem';

class Notifications extends Component {
  state = {
    showDropdown: false,
  };

  toggleDropdown = () => {
    const current = this.state.showDropdown;
    this.setState({ showDropdown: !current });
  };

  render() {
    const { showDropdown } = this.state;

    return (
      <NavItem>
        <NotifBtn onClick={this.toggleDropdown} />
        {showDropdown && <NotifDropdown />}
      </NavItem>
    );
  }
}

export default Notifications;
