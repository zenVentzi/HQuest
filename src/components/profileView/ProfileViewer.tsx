import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { getLoggedUserId, overrideTheme } from "Utils";
import Avatar from "../reusable/Avatar";
import Username from "./Username";
import Intro from "./Intro";
import FollowBtn from "./FollowBtn";
import FollowingBtn from "./FollowingBtn";
import FollowersBtn from "./FollowersBtn";
import Followers from "./Followers";
import Following from "./Following";
import Links from "./Links";
import QuestionsContainer from "./questions";
import Search from "./Search";
import ToggleQuestions from "./questions/ToggleQuestions";

interface ProfileViewerProps {
  user: any;
}

const ProfileViewer = (props: ProfileViewerProps) => {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const toggleFollowers = () => {
    setShowFollowers(!showFollowers);
  };

  const toggleFollowing = () => {
    setShowFollowing(!showFollowing);
  };

  const { user } = props;
  const isFollowed =
    user.followers && user.followers.includes(getLoggedUserId());
  const theme = {
    avatarSize: "150px"
  };

  return (
    <ThemeProvider theme={overrideTheme(theme)}>
      <>
        <Avatar src={user.avatarSrc} editable={user.me} />
        <Username>{user.fullName}</Username>
        <Intro>{user.intro}</Intro>
        {!user.me && <FollowBtn isFollowed={isFollowed} userId={user.id} />}
        <div>
          <FollowingBtn following={user.following} onClick={toggleFollowing} />
          <FollowersBtn followers={user.followers} onClick={toggleFollowers} />
        </div>
        {showFollowers && (
          <Followers userId={user.id} onClose={toggleFollowers} />
        )}
        {showFollowing && (
          <Following userId={user.id} onClose={toggleFollowing} />
        )}
        <Links />
        {/* <Search placeholder="Search questions.." onChange={() => {}} /> */}
        <QuestionsContainer user={user} />
      </>
    </ThemeProvider>
  );
};

export default ProfileViewer;
