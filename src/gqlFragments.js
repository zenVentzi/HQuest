import gql from 'graphql-tag';

export const UserFields = gql`
  fragment UserFields on User {
    id
    fullName
    avatarSrc
    intro
    socialMediaLinks {
      facebookLink
      twitterLink
      instagramLink
      linkedInLink
    }
    me
    followers
    following
  }
`;

export const CommentFields = gql`
  fragment CommentFields on Comment {
    id
    user {
      ...UserFields
    }
    comment
  }
  ${UserFields}
`;

export const AnswerFields = gql`
  fragment AnswerFields on Answer {
    id
    userId
    questionId
    value
    comments {
      ...CommentFields
    }
    likes {
      total
      likers {
        user {
          ...UserFields
        }
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
  ${UserFields}
  ${CommentFields}
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
