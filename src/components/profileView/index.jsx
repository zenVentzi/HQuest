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

const GET_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      fullName
      avatarSrc
    }
  }
`;

class ProfileView extends Component {
  constructor(props) {
    super(props);

    this.state = { answered: true };
  }

  onToggleQuestions = e => {
    const isOn = e.target.checked;
    this.setState({ answered: !isOn });
  };

  render() {
    const vars = { id: 2 };
    return (
      <Query query={GET_USER} variables={vars}>
        {({ loading, error, data: { user } }) => {
          if (loading) return <div> loading </div>;
          if (error) return <div> {error} </div>;
          if (!user) return <div> User not found </div>;

          return (
            <Fragment>
              <Navbar />
              <StyledView>
                <Avatar src={user.avatarSrc} />
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
                <ToggleQuestions onClick={this.onToggleQuestions} />
                <QuestionsContainer
                  userId={1}
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

export default ProfileView;
