import React from 'react';
import Avatar from './Avatar';
import StyledUserName from '../.reusable/StyledUserName';
import Search from './Search';
import QuestionsContainer from './Questions';
import StyledView from '../.reusable/StyledView';

const ProfileView = () => (
  <StyledView>
    <Avatar />
    <StyledUserName>
      Ventsislav Marinov
    </StyledUserName>
    <Search placeholder="Search questions.." />
    <QuestionsContainer />
  </StyledView>
);

export default ProfileView;
