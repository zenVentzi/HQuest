import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import Avatar from '../reusable/Avatar';

const StyledUserName = styled.div`
  /* font-size: 20px; */
  /* margin-bottom: 1em; */
`;

const StyledDescription = styled.div`
  font-size: 0.6em;
  color: gray;
`;

const TextContainer = styled.div`
  display: flex;
  padding: 0.1em 0em 1.5em 0.3em;
  flex-direction: column;
  justify-content: space-between;
`;

const UserContent = styled.div`
  display: flex;
  width: 60%;
  justify-content: flex-start;
`;

const StyledUser = styled.div`
  display: flex;
  height: 60px;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-radius: 0.3em;

  &:hover {
    opacity: 0.5;
    cursor: pointer;
    ${/* sc-selector */ StyledUserName} {
      color: white;
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

    // const theme = {
    //   avatarSize: '50px',
    // };
    return (
      <StyledUser
        onClick={() => {
          // redirect to user's page
          this.setState({ redirect: true });
        }}
      >
        <UserContent>
          <ThemeProvider
            theme={t => {
              console.log(t);
              return {};
            }}
          >
            <Avatar src={avatarSrc} />
          </ThemeProvider>
          <TextContainer>
            <StyledUserName>{fullName}</StyledUserName>
            <StyledDescription>CEO at Microsoft</StyledDescription>
          </TextContainer>
        </UserContent>
      </StyledUser>
    );
  }
}

export default User;
