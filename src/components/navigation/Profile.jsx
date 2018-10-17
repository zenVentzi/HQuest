import React from 'react';
import IconBtn from 'Reusable/IconBtn';
import { UserCircle } from 'styled-icons/fa-solid/UserCircle';
import { getLoggedUserId } from 'Utils';
import NavItem from './NavItem';

const Profile = () => {
  const link = `/userProfile/${getLoggedUserId()}`;

  return (
    <NavItem>
      <IconBtn icon={UserCircle} link={link} />
    </NavItem>
  );
};

export default Profile;
