import React, { Component, useRef } from "react";
import { useClickOutside } from "use-events";
import styled from "styled-components";
import Notif from "./Notif";
import { ApolloError } from "apollo-client";
import { NotificationsNotifications } from "GqlClient/autoGenTypes";

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

export interface NotifDropdownProps {
  loading: boolean;
  error: ApolloError;
  notifications: NotificationsNotifications[];
  onClickNotification: any;
  onClickOutside: any;
}

const NotifDropdown = (props: NotifDropdownProps) => {
  const ref = useRef();
  useClickOutside(ref, event => {
    props.onClickOutside(event);
  });

  const { loading, error, notifications, onClickNotification } = props;
  if (loading) return <div> loading questions.. </div>;
  if (error) return <div> {`Error ${error}`}</div>;

  return (
    <Dropdown ref={ref}>
      {notifications && notifications.length ? (
        notifications.map(n => (
          <Notif key={n.id} notif={n} onClick={onClickNotification} />
        ))
      ) : (
        <Text>No notifications yet</Text>
      )}
    </Dropdown>
  );
};

export default NotifDropdown;
