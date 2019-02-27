import React, { Component } from "react";
import onClickOutside, { HandleClickOutside } from "react-onclickoutside";
import styled from "styled-components";
import Notif from "./Notif";
import { ApolloError } from "apollo-client";

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
  right: 0em;
  background-color: white;
  width: 20em;
  max-width: 100vw;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;

  @media (max-width: 600px) {
    right: -7.7em;
  }
`;

// TODO try to make this component use the Dropdown from Reusable

interface NotifDropdownProps {
  loading: boolean;
  error: ApolloError;
  notifications: any[];
  onClickNotification: any;
  onClickOutside: any;
}

class NotifDropdown extends Component<NotifDropdownProps> {
  handleClickOutside: (e: any) => void = e => {
    this.props.onClickOutside(e);
  };

  render() {
    const { loading, error, notifications, onClickNotification } = this.props;
    if (loading) return <div> loading questions.. </div>;
    if (error) return <div> {`Error ${error}`}</div>;

    return (
      <Dropdown>
        {notifications && notifications.length ? (
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