import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
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
  /* border: 1px solid black; */

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

class User extends Component {
  state = { redirect: false };

  render() {
    const {
      user: { id, fullName, avatarSrc },
    } = this.props;

    if (this.state.redirect) {
      const redirectTo = `/userProfile/${id}`;
      return <Redirect push to={redirectTo} />;
    }

    const theme = {
      avatarSize: '50px',
    };
    return (
      <StyledUser
        onClick={() => {
          // redirect to user's page
          this.setState({ redirect: true });
        }}
      >
        <ThemeProvider theme={theme}>
          <Avatar src={avatarSrc} />
        </ThemeProvider>
        <StyledUserName>{fullName}</StyledUserName>
      </StyledUser>
    );
  }
}

export default User;
