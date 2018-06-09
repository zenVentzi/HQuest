import React from 'react';
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
      id,
      firstName,
      surName,
      questionIds,
    }
  }`;

const ProfileView = (props) => {
  const test = 5;

  return (
    <div>
      <Navbar />
      <StyledView>
        <Query
          query={GET_USER}
          variables={{ id: 1 }}
        >
          {({loading, error, data}) => {
            console.log(data)
            // const fullName = `${data.user.firstName} ${data.user.surName}`;

            return (
              <div>
                <Avatar />
                <StyledUserName>
                  {/* {fullName} */}
                </StyledUserName>
                <Search placeholder="Search questions.." />
                <ToggleQuestions />
                {/* <QuestionsContainer userId={data.user.id} /> */}
              </div>
            );
          }}
        </Query>
      </StyledView>
    </div>
  );
}

export default ProfileView;
