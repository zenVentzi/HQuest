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
      firstName
      surName
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
    return (
      <Fragment>
        <Navbar />
        <StyledView>
          <Avatar />
          <StyledUserName>
            <p> aaaafdfdfdf </p>
            {/* {fullName} */}fdfdf
          </StyledUserName>
          <Search
            placeholder="Search questions.."
            onChange={() => {
              const test = 5;
            }}
          />
          <ToggleQuestions onClick={this.onToggleQuestions} />
          <QuestionsContainer userId={1} showAnswered={this.state.answered} />
        </StyledView>
      </Fragment>
    );
  }
}

export default ProfileView;
