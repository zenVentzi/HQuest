import React from 'react';
import styled from 'styled-components';

const StyledAvatarUpdate = styled.div`
  pointer-events: none;
  display: inline-block;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.50)
  
  color: white;
  line-height: 150px;`;

const AvatarUpdate = () => (
  <StyledAvatarUpdate>
    <a href="/">Update</a>
  </StyledAvatarUpdate>
);

export default AvatarUpdate;
