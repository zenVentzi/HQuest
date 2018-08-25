import React from 'react';
import ProfileBtn from './ProfileBtn';
import NavItem from './NavItem';
import { loggedUserId, history } from '../../utils';

const Profile = () => {
  const onClick = () => {
    const redirectTo = `/userProfile/${loggedUserId()}`;
    history.push(redirectTo);
  };

  return (
    <NavItem>
      <ProfileBtn onClick={onClick} />
    </NavItem>
  );
};

export default Profile;
