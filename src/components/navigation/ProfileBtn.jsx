import React from 'react';
import { UserCircle } from 'styled-icons/fa-solid/UserCircle';

import Btn from '../reusable/Btn';
import Icon from '../reusable/Icon';

const ProfileBtn = props => {
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
