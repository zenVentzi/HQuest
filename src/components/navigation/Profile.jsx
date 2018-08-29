import React from 'react';
import ProfileBtn from './ProfileBtn';
import NavItem from './NavItem';
import { loggedUserId } from '../../utils';

const Profile = () => {
  const link = `/userProfile/${loggedUserId()}`;

  return (
    <NavItem>
      <ProfileBtn link={link} />
    </NavItem>
  );
};

export default Profile;
