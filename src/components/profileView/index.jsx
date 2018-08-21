import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Links from './Links';
import Avatar from './Avatar';
import Search from './Search';
import Navbar from '../navigation';
import QuestionsContainer from './questions';
import StyledViewRaw from '../reusable/StyledView';
import ToggleQuestions from './ToggleQuestions';
import styled from '../../../node_modules/styled-components';

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

const StyledView = styled(StyledViewRaw)`
  align-items: center;
`;

const StyledUserName = styled.div`
  font-size: 1.2em;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
`;

const StyledIntro = styled.div`
  font-size: 0.8em;
  margin-bottom: 0.6em;
  color: #282828;
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

          return (
            <Fragment>
              <Navbar />
              <StyledView>
                <Avatar src={user.avatarSrc} personal={user.me} />
                <StyledUserName>{user.fullName}</StyledUserName>
                <StyledIntro>CEO at Microsoft</StyledIntro>
                <Links />
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
