import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import Avatar from '../reusable/Avatar';
import { history } from '../../utils';

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
    opacity: 0.5;
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

const Text = styled.div`
  font-size: 0.8em;
  text-align: left;
  word-break: break-all;
`;

const Time = styled.div`
  font-size: 0.5em;
`;

class Notif extends Component {
  state = { redirect: false };

  onCLick = () => {
    const { performerId } = this.props.notif;
    const redirectTo = `/userProfile/${performerId}`;
    // return <Redirect push to={redirectTo} />;
    history.push(redirectTo);
  };
  render() {
    const theme = {
      avatarSize: `${2.3}em`,
    };

    // if msg length is > 80, cut and add ..

    const {
      notif: { performerId, performerAvatarSrc, text },
    } = this.props;

    // if (this.state.redirect) {
    //   const redirectTo = `/userProfile/${performerId}`;
    //   return <Redirect push to={redirectTo} />;
    // }

    return (
      <StyledNotif onClick={this.onCLick}>
        <Left>
          <ThemeProvider theme={theme}>
            <Avatar src={performerAvatarSrc} />
          </ThemeProvider>
        </Left>
        <Right>
          <Text>{text}</Text>
          <Time>1 hour ago</Time>
        </Right>
      </StyledNotif>
    );
  }
}

export default Notif;
