import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import styled from 'styled-components';
import Notif from './Notif';

const Text = styled.div`
  color: black;
  margin: 1em;
`;

const Dropdown = styled.div`
  max-height: 20em;
  overflow-y: auto;
  border: 1px solid black;
  border-radius: 0.2em;
  position: absolute;
  text-align: center;
  top: 2.2em;
  right: -7.7em;
  background-color: white;
  width: 20em;
  max-width: 100vw;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

// TODO try to make this component use the Dropdown from Reusable

class NotifDropdown extends Component {
  handleClickOutside = e => {
    this.props.onClickOutside(e);
  };

  render() {
    const { loading, error, notifications, onClickNotification } = this.props;
    if (loading) return <div> loading questions.. </div>;
    if (error) return <div> {`Error ${error}`}</div>;

    return (
      <Dropdown>
        {notifications.length ? (
          notifications.map(n => (
            <Notif key={n.id} notif={n} onClick={onClickNotification} />
          ))
        ) : (
          <Text>No notifications yet</Text>
        )}
      </Dropdown>
    );
  }
}

export default onClickOutside(NotifDropdown);
