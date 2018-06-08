import React from 'react';
import styled from 'styled-components';
import StyledAvatarWrapper from '../reusable/StyledAvatarWrapper';
import StyledAvatarImage from '../reusable/StyledAvatarImage';

const UpdateOverlay = styled.div`
  pointer-events: none;
  display: inline-block;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.50)
  
  color: white;
  line-height: 150px;`;

const Avatar = () => (
  <StyledAvatarWrapper>
    <StyledAvatarImage src="/" alt="" />
    <UpdateOverlay />
  </StyledAvatarWrapper>
);

export default Avatar;
