import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
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

class NotifDropdown extends Component {
  handleClickOutside = e => {
    this.props.onClickOutside(e);
  };

  render() {
    const { loading, error, notifications } = this.props;
    if (loading) return <div> loading questions.. </div>;
    if (error) return <div> {`Error ${error}`}</div>;

    return (
      <Dropdown>
        {notifications.map(n => (
          <Notif key={n.id} notif={n} />
        ))}
      </Dropdown>
    );
  }
}

export default onClickOutside(NotifDropdown);
