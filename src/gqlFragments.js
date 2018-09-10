import gql from 'graphql-tag';

export const QuestionFields = gql`
  fragment QuestionFields on Question {
    id
    question
    type
    possibleAnswers
  }
`;

export const AnswerFields = gql`
  fragment AnswerFields on Answer {
    id
    userId
    questionId
    value
    numOfComments
  }
`;

export const NotificationFields = gql`
  fragment NotificationFields on Notification {
    id
    type
    performerId
    performerAvatarSrc
    text
    seen
    createdOn
    ... on NewComment {
      commentId
      questionId
    }
  }
`;
