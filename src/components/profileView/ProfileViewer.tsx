import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { getLoggedUserId } from "Utils";
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
import { UserFieldsFragment } from "GqlClient/autoGenTypes";

const Superscript = styled.span`
  background-color: #fa3e3e;
  border-radius: 2px;
  color: white;

  padding: 1px 3px;
  font-size: 10px;

  position: relative;
  vertical-align: super;
  user-select: none;
  top: 200;
  right: 0;
`;

interface ProfileViewerProps {
  user: UserFieldsFragment;
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
    user.followers && user.followers.includes(getLoggedUserId()!);

  return (
    <ThemeProvider
      theme={currentTheme => {
        return { ...currentTheme, avatarSize: "150px" };
      }}
    >
      <>
        <Avatar src={user.avatarSrc} editable={!!user.me} />
        <Username>
          {user.fullName}
          <Superscript>{user.experience}exp</Superscript>
        </Username>
        <Intro>{user.intro}</Intro>
        {!user.me && <FollowBtn isFollowed={!!isFollowed} userId={user.id} />}
        <div>
          <FollowingBtn
            numOfFollowing={user.following ? user.following.length : 0}
            onClick={toggleFollowing}
          />
          <FollowersBtn
            numOfFollowers={user.followers ? user.followers.length : 0}
            onClick={toggleFollowers}
          />
        </div>
        {showFollowers && (
          <Followers userId={user.id} onClose={toggleFollowers} />
        )}
        {showFollowing && (
          <Following userId={user.id} onClose={toggleFollowing} />
        )}
        <Links links={user.socialMediaLinks} />
        {/* <Search placeholder="Search questions.." onChange={() => {}} /> */}
        <QuestionsContainer user={user} />
      </>
    </ThemeProvider>
  );
};

export default ProfileViewer;
