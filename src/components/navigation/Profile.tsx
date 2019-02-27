import React from 'react';
import IconLink from 'Reusable/IconLink';
import { UserCircle } from 'styled-icons/fa-solid/UserCircle';
import { getLoggedUserId } from 'Utils';
import NavItem from './NavItem';

const Profile = () => {
  const link = `/userProfile/${getLoggedUserId()}`;

  return (
    <NavItem>
      <IconLink icon={UserCircle} to={link} />
    </NavItem>
  );
};

export default Profile;
