import React, { Component } from 'react';
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

const timeAgoText = createdOn => {
  const startDate = new Date(createdOn).getTime();
  const timeNow = new Date().getTime();
  const seconds = (timeNow - startDate) / 1000;
  const mins = seconds / 60;
  const hours = mins / 60;
  const days = hours / 24;

  let res;

  if (days) {
    res = days > 1 ? `${days} days ago` : `yesterday`;
  } else if (hours) {
    res = hours > 1 ? `${hours} hours ago` : `1 hour ago`;
  } else if (mins) {
    res = days > 1 ? `${mins} mins ago` : `a minute ago`;
  } else {
    res = days > 1 ? `${seconds} seconds ago` : `a second ago`;
  }

  return res;
};

class Notif extends Component {
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
      notif: { performerAvatarSrc, text, createdOn },
    } = this.props;

    console.log(new Date(createdOn));

    return (
      <StyledNotif onClick={this.onCLick}>
        <Left>
          <ThemeProvider theme={theme}>
            <Avatar src={performerAvatarSrc} />
          </ThemeProvider>
        </Left>
        <Right>
          <Text>{text}</Text>
          <Time>{timeAgoText(createdOn)}</Time>
        </Right>
      </StyledNotif>
    );
  }
}

export default Notif;
