import gql from 'graphql-tag';
import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import styled from '../../../node_modules/styled-components';
import Navbar from '../navigation';
import StyledViewRaw from '../reusable/StyledView';
import Avatar from '../reusable/Avatar';
import Username from './Username';
import Intro from './Intro';
import FollowBtn from './FollowBtn';
import Links from './Links';
import QuestionsContainer from './questions';
import Search from './Search';
import ToggleQuestions from './ToggleQuestions';
import { loggedUserId } from '../../utils';

const GET_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      fullName
      avatarSrc
      me
      followers
      following
    }
  }
`;

const StyledView = styled(StyledViewRaw)`
  align-items: center;
`;

class ProfileView extends Component {
  state = { answered: true };

  onToggleQuestions = e => {
    const isOn = e.target.checked;
    this.setState({ answered: !isOn });
  };

  render() {
    const { id } = this.props.match.params;
    const vars = { id };

    return (
      <Query query={GET_USER} variables={vars}>
        {({ loading, error, data: { user } }) => {
          if (loading) return <div> loading profile view </div>;
          if (error) return <div> {error} </div>;
          if (!user) return <div> User not found </div>;
          const isFollowed = user.followers.includes(loggedUserId());

          return (
            <Fragment>
              <Navbar />
              <StyledView>
                <Avatar src={user.avatarSrc} editable={user.me} />
                <Username>{user.fullName}</Username>
                <Intro>CEO at Microsoft</Intro>
                <Links />
                {!user.me && (
                  <FollowBtn isFollowed={isFollowed} userId={user.id} />
                )}
                <Search
                  placeholder="Search questions.."
                  onChange={() => {
                    const test = 5;
                  }}
                />
                {user.me && (
                  <ToggleQuestions onClick={this.onToggleQuestions} />
                )}
                <QuestionsContainer
                  user={user}
                  showAnswered={this.state.answered}
                />
              </StyledView>
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

// export { viewedProfileId };

export default ProfileView;
