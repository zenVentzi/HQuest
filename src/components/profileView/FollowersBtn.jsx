import React from 'react';
import styled from 'styled-components';
import TextBtn from 'Reusable/TextBtn';

const Btn = styled(TextBtn)`
  margin-bottom: 1em;
`;

const FollowersBtn = ({ followers, onClick }) => {
  return <Btn onClick={onClick}>Followers {followers.length}</Btn>;
};

export default FollowersBtn;
