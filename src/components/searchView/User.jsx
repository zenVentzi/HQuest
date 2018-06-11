import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Avatar from '../reusable/Avatar';
import StyledUserName from '../reusable/StyledUserName';

const StyledUser = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  height: 60px;
  align-items: center;
  justify-content: space-around;
  z-index: 1;
  border-radius: 0.3em;
  border: 1px solid black;

  &:hover {
    background: black;
    cursor: pointer;
    ${StyledUserName} {
      color: white;
    }
    ${Avatar} {
      border-color: white;
    }
  }
`;

const User = ({ username, avatarSrc }) => {
  const theme = {
    avatarSize: '50px',
  };

  return (
    <StyledUser>
      <ThemeProvider theme={theme}>
        <Avatar src={avatarSrc} />
        <StyledUserName>
          {/* {username} */}
          Ventsislav Marinov
        </StyledUserName>
      </ThemeProvider>
    </StyledUser>
  );
};

export default User;
