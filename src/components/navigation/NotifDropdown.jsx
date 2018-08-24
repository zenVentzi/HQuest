import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import Notif from './Notif';

const Dropdown = styled.div`
  max-height: 20em;
  overflow-y: auto;
  border-radius: 0.2em;
  position: absolute;
  text-align: center;
  top: 2.2em;
  right: 0;
  background-color: white;
  width: 20em;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const LOG_OUT = `/logout`;
const ADMIN = `/admin`;

class NotifDropdown extends Component {
  state = {
    redirectRoute: null,
  };

  onClick = route => () => {
    this.setState({ redirectRoute: route });
  };

  render() {
    if (this.state.redirectRoute) {
      return <Redirect push to={this.state.redirectRoute} />;
    }

    return (
      <Dropdown>
        <Notif />
        <Notif />
        <Notif />
        <Notif />
        <Notif />
        <Notif />
        <Notif />
        <Notif />
        <Notif />
        <Notif />
        <Notif />
        <Notif />
      </Dropdown>
    );
  }
}

export default NotifDropdown;
