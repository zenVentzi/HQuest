import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled, { ThemeProvider, withTheme } from 'styled-components';
import distanceInWords from 'date-fns/distance_in_words';
import { getTheme, inverseColor } from 'Utils';
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
  switch (notif.type) {
    case 'NEW_FOLLOWER':
      return `/userProfile/${performerId}`;
      break;
    case 'NEW_COMMENT':
      return `/userProfile/${performerId}/${questionId}/${commentId}`;
      break;
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
    const { notif } = this.props;
    const redirectLink = getLink(notif);

    const { theme } = this.state;

    return (
      <ThemeProvider theme={getTheme(theme)}>
        <StyledNotif
          to={redirectLink}
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
