import React from 'react';
import styled from 'styled-components';
import Avatar from './Avatar';
import UserName from './UserName';
import Search from './Search';
import QuestionList from './Questions';

const StyledUserProfile = styled.div`
  text-align: center;`;

const UserProfile = () => (
  <StyledUserProfile>
    <Avatar />
    <UserName />
    <Search />
    <QuestionList />
  </StyledUserProfile>
);

export default UserProfile;
