import React from 'react';
import styled from 'styled-components';

const StyledAvatarImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%)`;

const AvatarImage = () => (
  <StyledAvatarImage src="/" alt="" />
);

export default AvatarImage;
