import React from 'react';
import Avatar from './Avatar';
import StyledUserName from '../.reusable/StyledUserName';
import Search from './Search';
import QuestionsContainer from './Questions';
import StyledContentComponent from '../.reusable/StyledContentComponent';

const UserProfile = () => (
  <StyledContentComponent>
    <Avatar />
    <StyledUserName>
      Ventsislav Marinov
    </StyledUserName>
    <Search placeholder="Search questions.." />
    <QuestionsContainer />
  </StyledContentComponent>
);

export default UserProfile;
