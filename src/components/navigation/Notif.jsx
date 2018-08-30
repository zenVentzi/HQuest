import React from 'react';
import { Link } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { getTheme } from 'Utils';
import Avatar from '../reusable/Avatar';

const StyledNotif = styled(Link)`
  text-decoration: none;
  display: flex;
  padding: 0.7em;
  width: 100%;
  cursor: pointer;

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
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
  color: black;
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

const Notif = ({
  notif: { performerAvatarSrc, performerId, questionId, text, createdOn },
}) => {
  const theme = {
    avatarSize: `${2.3}em`,
  };
  const redirectLink = `/userProfile/${performerId}/${questionId}`;

  return (
    <StyledNotif to={redirectLink}>
      <Left>
        <ThemeProvider theme={getTheme(theme)}>
          <Avatar src={performerAvatarSrc} invertColors />
        </ThemeProvider>
      </Left>
      <Right>
        <Text>{text}</Text>
        <Time>{timeAgoText(createdOn)}</Time>
      </Right>
    </StyledNotif>
  );
};

export default Notif;
