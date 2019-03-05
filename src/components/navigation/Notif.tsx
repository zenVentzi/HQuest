import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import distanceInWords from "date-fns/distance_in_words";
import { getLoggedUserId, overrideTheme, inverseColor } from "Utils";
import Avatar from "../reusable/Avatar";
import {
  NotificationsNotifications,
  NotificationType
} from "GqlClient/autoGenTypes";

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
  font-weight: bold;
  color: ${props => props.theme.foregroundColor};
  text-align: left;
  word-break: break-all;
`;

const Time = styled.div`
  color: ${props => props.theme.foregroundColor};
  /* font-size: 0.5em; */
`;

const getTime = (createdOn: string) => {
  const startDate = new Date(createdOn).getTime();
  const dateTimeNow = new Date().getTime();

  const res = distanceInWords(startDate, dateTimeNow, {
    includeSeconds: true
  });

  return `${res} ago`;
};

const getLink = (notif: NotificationsNotifications) => {
  const { performerId, questionId, commentId } = notif;
  const loggedUsrId = getLoggedUserId();

  switch (notif.type) {
    case NotificationType.NewFollower:
      return `/userProfile/${performerId}`;
    case NotificationType.NewComment /* 
    answerOwnerId in this case the current logged userid
    later, when we get notifications for other people's posts' comments we will upgrade that
    */:
      return `/userProfile/${loggedUsrId}/${questionId}/${commentId}`;
    default:
      break;
  }

  return null;
};

interface NotifProps {
  onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  notif: NotificationsNotifications;
}

interface NotifTheme {
  backgroundColor: "black" | "white";
  foregroundColor: "black" | "white";
  avatarSize: string;
}

const Notif = ({ onClick, notif }: NotifProps) => {
  const [theme, setTheme] = useState<NotifTheme>({
    avatarSize: "2.2em",
    backgroundColor: "white",
    foregroundColor: "black"
  });

  useEffect(() => {});

  const toggleTheme = () => {
    const old = theme;
    const neww = { ...old };
    neww.backgroundColor = inverseColor(old.backgroundColor);
    neww.foregroundColor = inverseColor(old.foregroundColor);
    setTheme(neww);
  };

  const redirectLink = getLink(notif);

  return (
    <ThemeProvider theme={overrideTheme(theme)}>
      <StyledNotif
        // @ts-ignore
        to={redirectLink}
        onClick={onClick}
        onMouseEnter={toggleTheme}
        onMouseLeave={toggleTheme}
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
};

export default Notif;
