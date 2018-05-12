import React from 'react';
import styled from 'styled-components';
import AvatarImage from './AvatarImage';
import AvatarUpdate from './AvatarUpdate';

const StyledUserAvatar = styled.div`
  font-size: 20px;
  text-align: center;
  
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid black;`;

const UserAvatar = () => (
  <StyledUserAvatar>
    <AvatarImage />
    <AvatarUpdate />
  </StyledUserAvatar>
);

export default UserAvatar;
