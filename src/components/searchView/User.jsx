import React from 'react';
import { Link } from 'react-router-dom';
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

const User = ({ user: { id, fullName, avatatarSrc } }) => {
  const theme = {
    avatarSize: '50px',
  };

  const linkTo = `/userProfile/${id}`;

  return (
    // <StyledUser
    //   onClick={() => {
    //     // redirect to user's page
    //   }}
    // >
    //   <ThemeProvider theme={theme}>
    //     <Avatar src={avatarSrc} />
    //   </ThemeProvider>
    //   <StyledUserName>{fullName}</StyledUserName>
    // </StyledUser>
    <Link to={linkTo}> {fullName} </Link>
  );
};

export default User;
