import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle } from 'styled-icons/fa-solid/UserCircle';

import Btn from '../reusable/Btn';
import Icon from '../reusable/Icon';

const ProfileBtn = props => {
  const holder = 1;

  return (
    <Btn link={props.link}>
      <Icon>
        <UserCircle />
      </Icon>
    </Btn>
  );
};
// bla
export default ProfileBtn;
