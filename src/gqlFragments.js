import gql from 'graphql-tag';

export const AnswerFields = gql`
  fragment AnswerFields on Answer {
    id
    userId
    questionId
    value
    numOfComments
    likes {
      total
      likers {
        id
        numOfLikes
      }
    }
    editions {
      id
      date
      before
      after
    }
    position
  }
`;

export const CommentFields = gql`
  fragment CommentFields on Comment {
    id
    user {
      id
      fullName
      intro
      avatarSrc
      me
    }
    comment
  }
`;

export const QuestionFields = gql`
  fragment QuestionFields on Question {
    id
    question
    type
    defaultAnswer
    possibleAnswers
    tags
    answer {
      ...AnswerFields
    }
  }
  ${AnswerFields}
`;

export const PageInfoFields = gql`
  fragment PageInfoFields on PageInfo {
    startCursor
    endCursor
    hasNextPage
    hasPreviousPage
  }
`;

export const QuestionEdgeFields = gql`
  fragment QuestionEdgeFields on Edge {
    cursor
    node {
      ...QuestionFields
    }
  }
  ${QuestionFields}
`;

export const QuestionConnectionFields = gql`
  fragment QuestionConnectionFields on QuestionConnection {
    pageInfo {
      ...PageInfoFields
    }
    edges {
      ...QuestionEdgeFields
    }
    totalCount
  }
  ${PageInfoFields}
  ${QuestionEdgeFields}
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
