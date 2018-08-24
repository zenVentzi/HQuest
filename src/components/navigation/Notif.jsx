import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import Avatar from '../reusable/Avatar';

const StyledNotif = styled.div`
  background: black;
  display: flex;
  padding: 0.7em;
  color: white;
  width: 100%;
  cursor: pointer;

  ${Avatar} {
    border-color: white;
  }

  &:hover {
    border: 0.1em solid white;
  }
`;

const Left = styled.div`
  flex-shrink: 0;
  margin-right: 0.1em;
`;
const Right = styled.div`
  display: flex;
  flex-grow: 0;
  padding: 0.2em;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`;

const Message = styled.div`
  font-size: 0.8em;
  text-align: left;
  word-break: break-all;
`;

const Time = styled.div`
  font-size: 0.5em;
`;

class Notif extends Component {
  state = { redirect: false };
  render() {
    const theme = {
      avatarSize: `${2.3}em`,
    };

    // if msg length is > 80, cut and add ..

    // const {
    //   notif: { id: notifId, userId, questionId },
    // } = this.props;

    const avatarSrc = ``;

    // if (this.state.redirect) {
    //   const redirectTo = `/userProfile/${userId}/${questionId}/${notifId}`;
    //   return <Redirect push to={redirectTo} />;
    // }

    return (
      <StyledNotif
        onClick={() => {
          this.setState({ redirect: true });
        }}
      >
        <Left>
          <ThemeProvider theme={theme}>
            <Avatar src={avatarSrc} />
          </ThemeProvider>
        </Left>
        <Right>
          <Message>
            Pesho Goshev commented
            <q>Hey, what about..?</q>
          </Message>
          <Time>1 hour ago</Time>
        </Right>
      </StyledNotif>
    );
  }
}

export default Notif;
