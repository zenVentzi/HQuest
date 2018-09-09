import React from 'react';
import IconBtn from 'Reusable/IconBtn';
import { UserCircle } from 'styled-icons/fa-solid/UserCircle';
import NavItem from './NavItem';
import { loggedUserId } from '../../utils';

const Profile = () => {
  const link = `/userProfile/${loggedUserId()}`;

  return (
    <NavItem>
      <IconBtn icon={UserCircle} link={link} />
    </NavItem>
  );
};

export default Profile;
