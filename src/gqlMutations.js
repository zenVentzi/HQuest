import gql from 'graphql-tag';

export const NOTIFS_MARK_SEEN = gql`
  mutation notifsMarkSeen {
    notifsMarkSeen
  }
`;

export const EDIT_USER = gql`
  mutation editUser($input: EditUserInput) {
    editUser(input: $input) {
      id
    }
  }
`;

export const EDIT_ANSWER = gql`
  mutation editAnswer($answerId: ID!, $answerValue: String!) {
    editAnswer(answerId: $answerId, answerValue: $answerValue) {
      id
      userId
      questionId
      value
    }
  }
`;

export const ADD_ANSWER = gql`
  mutation addAnswer($questionId: ID!, $answerValue: String!) {
    addAnswer(questionId: $questionId, answerValue: $answerValue) {
      id
      userId
      questionId
      numOfComments
      value
    }
  }
`;
