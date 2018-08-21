import React from 'react';
import { Notifications } from 'styled-icons/material/Notifications';

const NotificationsBtn = props => {
  const holder = 5;

  return <Notifications size="2em" css="cursor: pointer" {...props} />;
};

export default NotificationsBtn;
