import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import distanceInWords from 'date-fns/distance_in_words';
import { getLoggedUserId, overrideTheme, inverseColor } from 'Utils';
import Avatar from '../reusable/Avatar';

const StyledNotif = styled(Link)`
  text-decoration: none;
  display: flex;
  padding: 0.4em;
  width: 100%;
  cursor: pointer;
  background: ${props => props.theme.backgroundColor};

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
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
  color: ${props => props.theme.foregroundColor};
  text-align: left;
  word-break: break-all;
`;

const Time = styled.div`
  color: ${props => props.theme.foregroundColor};
  font-size: 0.5em;
`;

const getTime = createdOn => {
  const startDate = new Date(createdOn).getTime();
  const dateTimeNow = new Date().getTime();

  const res = distanceInWords(startDate, dateTimeNow, {
    includeSeconds: true,
  });

  return `${res} ago`;
};

const getLink = notif => {
  const { performerId, questionId, commentId } = notif;
  const loggedUsrId = getLoggedUserId();

  switch (notif.type) {
    case 'NEW_FOLLOWER':
      return `/userProfile/${performerId}`;
    case 'NEW_COMMENT' /* 
    answerOwnerId in this case the current logged userid
    later, when we get notifications for other people's posts' comments we will upgrade that
    */:
      return `/userProfile/${loggedUsrId}/${questionId}/${commentId}`;
    default:
      break;
  }

  return null;
};

class Notif extends Component {
  state = {
    theme: {
      backgroundColor: 'white',
      foregroundColor: 'black',
      avatarSize: `${2.2}em`,
    },
  };

  toggleTheme = () => {
    const old = this.state.theme;
    const neww = { ...old };
    neww.backgroundColor = inverseColor(old.backgroundColor);
    neww.foregroundColor = inverseColor(old.foregroundColor);
    this.setState({ theme: neww });
  };

  render() {
    const { theme } = this.state;
    const { notif, onClick } = this.props;
    const redirectLink = getLink(notif);

    return (
      <ThemeProvider theme={overrideTheme(theme)}>
        <StyledNotif
          to={redirectLink}
          onClick={onClick}
          onMouseEnter={this.toggleTheme}
          onMouseLeave={this.toggleTheme}
        >
          <Left>
            <Avatar src={notif.performerAvatarSrc} invertColors />
          </Left>
          <Right>
            <Text>{notif.text}</Text>
            <Time>{getTime(notif.createdOn)}</Time>
          </Right>
        </StyledNotif>
      </ThemeProvider>
    );
  }
}

// export default withTheme(Notif);
export default Notif;
