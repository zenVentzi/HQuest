import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Avatar from './Avatar';
import StyledUserName from '../reusable/StyledUserName';
import Search from './Search';
import Navbar from '../navigation';
import QuestionsContainer from './questions';
import StyledView from '../reusable/StyledView';
import ToggleQuestions from './ToggleQuestions';

// let viewedProfileId;

const GET_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      fullName
      avatarSrc
      me
    }
  }
`;

class ProfileView extends Component {
  constructor(props) {
    super(props);
    // props.match.params.fullName
    this.state = { answered: true };
  }

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
          if (loading) return <div> loading </div>;
          if (error) return <div> {error} </div>;
          if (!user) return <div> User not found </div>;

          // viewedProfileId = user.id;

          return (
            <Fragment>
              <Navbar />
              <StyledView>
                <Avatar src={user.avatarSrc} personal={user.me} />
                <StyledUserName>
                  {/* <p> aaaafdfdfdf </p> */}
                  {user.fullName}
                </StyledUserName>
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
