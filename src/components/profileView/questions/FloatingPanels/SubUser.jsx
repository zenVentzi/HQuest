import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import Avatar from '../../../reusable/Avatar';

const StyledUserName = styled.div`
  font-size: ${props => `${0.6 * props.size}em`};
  /* margin-bottom: 1em; */
`;

const StyledDescription = styled.div`
  font-size: ${props => `${0.6 * props.size}em`};
  color: gray;
`;

const TextContainer = styled.div`
  display: flex;
  align-self: stretch;
  padding: ${props => `${0.3 * props.size}em`};
  flex-direction: column;
  justify-content: space-between;
`;

const StyledUser = styled.div`
  display: flex;
  margin-bottom: 0.3em;
  /* width: 100%; */
  align-items: center;
  justify-content: flex-start;
  z-index: 1;
  border-radius: 0.2em;
  /* border: 1px solid white; */
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
  // static defaultProps = {
  //   user: {
  //     id: '5b682375a23c7306b4a8d81e',
  //     fullName: 'Default Ivanonv1',
  //     avatarSrc: '/public/images/avatar5b682375a23c7306b4a8d81e.jpeg',
  //   },
  // };

  state = { redirect: false };

  render() {
    const {
      user: { id, fullName, intro, avatarSrc, me },
      size = 1,
    } = this.props;

    if (this.state.redirect) {
      if (me) {
        window.location.reload();
      } else {
        const redirectTo = `/userProfile/${id}`;
        return <Redirect push to={redirectTo} />;
      }
    }

    const theme = {
      avatarSize: `${1.5 * size}em`,
      reactionIconSize: `${1 * size}em`,
    };
    return (
      <StyledUser
        onClick={() => {
          this.setState({ redirect: true });
        }}
      >
        <ThemeProvider theme={theme}>
          <Avatar src={avatarSrc} />
        </ThemeProvider>
        <TextContainer size={size}>
          <StyledUserName size={size}>{fullName}</StyledUserName>
          <StyledDescription size={size}>{intro}</StyledDescription>
        </TextContainer>
      </StyledUser>
    );
  }
}

export default User;
