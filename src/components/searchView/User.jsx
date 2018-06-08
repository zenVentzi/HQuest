import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import StyledAvatarWrapper from '../reusable/StyledAvatarWrapper';
import StyledAvatarImage from '../reusable/StyledAvatarImage';
import StyledUserName from '../reusable/StyledUserName';

const StyledUser = styled.div`
  display: flex;
  width: 70%;
  flex-wrap: nowrap;
  height: 60px;
  align-items: center;
  justify-content: space-around;
  z-index: 1;
  border-radius: 0.3em;  

  &:hover {
    background: black;
    cursor: pointer;
    ${StyledUserName} {
      color: white;
    }
    ${StyledAvatarWrapper} {
      border-color: white;
    }
  }`;

const User = ({ username, avatarSrc }) => {
  const theme = {
    avatarSize: '50px',
  };

  return (
    <StyledUser>
      <ThemeProvider theme={theme}>
        <StyledAvatarWrapper>
          <StyledAvatarImage src={avatarSrc} />
        </StyledAvatarWrapper>
      </ThemeProvider>
      <StyledUserName>
        {username}
      </StyledUserName>
    </StyledUser>
  );
};

export default User;
