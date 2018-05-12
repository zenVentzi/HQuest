import React from 'react';
import styled from 'styled-components';
import Avatar from './Avatar';
import UserName from './UserName';
import Search from './Search';
import QuestionsContainer from './Questions';

const StyledUserProfile = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;
  text-align: center;
  width: 500px;`;

const UserProfile = () => (
  <StyledUserProfile>
    <Avatar />
    <UserName />
    <Search />
    <QuestionsContainer />
  </StyledUserProfile>
);

export default UserProfile;
