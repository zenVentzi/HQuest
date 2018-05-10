import React from 'react';
import UserAvatar from './UserAvatar';
import UserName from './UserName';
import Search from './Search';
import QuestionList from './Questions';
import style from './css/userProfile.css';

const UserProfile = () => (
  <div className="user-profile">
    <UserAvatar />
    <UserName />
    <Search />
    <QuestionList />
  </div>
);

export default UserProfile;
