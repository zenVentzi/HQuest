import gql from 'graphql-tag';
import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import styled, { ThemeProvider } from 'styled-components';
import Navbar from '../navigation';
import Avatar from '../reusable/Avatar';
import Username from './Username';
import Intro from './Intro';
import FollowBtn from './FollowBtn';
import FollowingBtn from './FollowingBtn';
import FollowersBtn from './FollowersBtn';
import Links from './Links';
import QuestionsContainer from './questions';
import Search from './Search';
import ToggleQuestions from './ToggleQuestions';
import { loggedUserId, getTheme } from '../../utils';

class ProfileViewer extends Component {
  state = { answered: true };

  onToggleQuestions = e => {
    const isOn = e.target.checked;
    this.setState({ answered: !isOn });
  };

  render() {
    const { user } = this.props;
    const isFollowed = user.followers.includes(loggedUserId());
    const theme = {
      avatarSize: '150px',
    };

    return (
      <ThemeProvider theme={getTheme(theme)}>
        <Fragment>
          <Avatar src={user.avatarSrc} editable={user.me} />
          <Username>{user.fullName}</Username>
          <Intro>{user.intro}</Intro>
          {!user.me && <FollowBtn isFollowed={isFollowed} userId={user.id} />}
          <div>
            <FollowingBtn following={user.following} />
            <FollowersBtn followers={user.followers} />
          </div>
          <Links />
          <Search placeholder="Search questions.." onChange={() => {}} />
          {user.me && <ToggleQuestions onClick={this.onToggleQuestions} />}
          <QuestionsContainer user={user} showAnswered={this.state.answered} />
        </Fragment>
      </ThemeProvider>
    );
  }
}

export default ProfileViewer;
