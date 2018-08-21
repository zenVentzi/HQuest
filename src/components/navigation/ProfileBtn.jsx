import React from 'react';
import { UserCircle } from 'styled-icons/fa-solid/UserCircle';

const ProfileBtn = props => {
  const holder = 5;

  return (
    <UserCircle
      size="2em"
      css="cursor: pointer; vertical-align: middle;"
      {...props}
    />
  );
};

export default ProfileBtn;
