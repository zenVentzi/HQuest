import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Avatar from './Avatar';
import StyledUserName from '../reusable/StyledUserName';
import Search from './Search';
import Navbar from '../navigation';
import QuestionsContainer from './Questions';
import StyledView from '../reusable/StyledView';
import ToggleQuestions from './ToggleQuestions';

const GET_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      firstName
      surName
      questionIds
    }
  }
`;

const ProfileView = props => {
  const onToggleQuestions = e => {
    const isOn = e.target.checked;
  };

  return (
    <Fragment>
      <Navbar />
      <StyledView>
        <Query query={GET_USER} variables={{ id: 1 }}>
          {({ loading, error, data }) => {
            if (loading) return <div> loading </div>;
            // const fullName = `${data.user.firstName} ${data.user.surName}`;

            return (
              <Fragment>
                <Avatar />
                <StyledUserName>
                  <p> aaaafdfdfdf </p>
                  {/* {fullName} */}fdfdf
                </StyledUserName>
                <Search
                  placeholder="Search questions.."
                  onChange={() => {
                    const a = 5;
                    const b = 110;
                  }}
                />
                <ToggleQuestions onClick={onToggleQuestions} />
                <QuestionsContainer userId={data.user.id} />
              </Fragment>
            );
          }}
        </Query>
      </StyledView>
    </Fragment>
  );
};

export default ProfileView;
