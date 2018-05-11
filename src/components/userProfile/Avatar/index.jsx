import React from 'react';
import styled from 'styled-components';
import AvatarImage from './AvatarImage';
import AvatarUpdate from './AvatarUpdate';

const StyledUserAvatar = styled.div`
  padding: initial;
  font-size: 20px;
  text-align: center;
  
  width: 150px;
  height: 150px;
  display: inline-block;
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid black;
  position: relative;`;

const UserAvatar = () => (
  <StyledUserAvatar>
    <AvatarImage />
    <AvatarUpdate />
  </StyledUserAvatar>
);

export default UserAvatar;
