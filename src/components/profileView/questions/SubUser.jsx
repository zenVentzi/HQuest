import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import Avatar from '../../reusable/Avatar';

const StyledUserName = styled.div`
  font-size: 0.6em;
  /* margin-bottom: 1em; */
`;

const StyledDescription = styled.div`
  font-size: 0.6em;
  color: gray;
`;

const TextContainer = styled.div`
  display: flex;
  align-self: stretch;
  padding: 0.3em;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledUser = styled.div`
  display: flex;
  /* height: 1em; */
  margin-bottom: 0.3em;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  z-index: 1;
  border-radius: 0.3em;
  background: black;

  ${Avatar} {
    border-color: white;
  }

  ${StyledUserName} {
    color: white;
  }

  &:hover {
    /* background: white; */
    cursor: pointer;
  }
`;

class User extends Component {
  static defaultProps = {
    user: {
      id: '5b682375a23c7306b4a8d81e',
      fullName: 'Default Ivanonv1',
      avatarSrc: '/public/images/avatar5b682375a23c7306b4a8d81e.jpeg',
    },
  };

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
      avatarSize: '1.5em',
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
        <TextContainer>
          <StyledUserName>{fullName}</StyledUserName>
          <StyledDescription>CEO at Microsoft</StyledDescription>
        </TextContainer>
      </StyledUser>
    );
  }
}

export default User;
