import gql from "graphql-tag";
import {
  NotificationFields,
  QuestionFields,
  QuestionConnectionFields,
  CommentFields,
  UserFields,
  AnswerFields
} from "graphql/gqlFragments";

export const GET_NEWSFEED = gql`
  query newsfeed {
    newsfeed {
      type
      createdOn
      ... on AnswerNews {
        performer {
          ...UserFields
        }
        question {
          ...QuestionFields
        }
      }
      ... on CommentNews {
        performer {
          ...UserFields
        }
        answerOwner {
          ...UserFields
        }
        question {
          ...QuestionFields
        }
        commentId
      }
      ... on NewLikeNews {
        performer {
          ...UserFields
        }
        answerOwner {
          ...UserFields
        }
        question {
          ...QuestionFields
        }
      }
      ... on NewFollowerNews {
        performer {
          ...UserFields
        }
        followedUser {
          ...UserFields
        }
      }
    }
  }
  ${UserFields}
  ${QuestionFields}
`;

export const GET_ANSWERED_QUESTION = gql`
  query answeredQuestion($userId: ID!, $questionId: ID!) {
    answeredQuestion(userId: $userId, questionId: $questionId) {
      ...QuestionFields
      answer {
        ...AnswerFields
      }
    }
  }
  ${QuestionFields}
  ${AnswerFields}
`;

export const GET_QUESTIONS = gql`
  query questions(
    $answered: Boolean!
    $userId: ID!
    $tags: [String]
    $first: Int!
    $after: String
  ) {
    questions(
      answered: $answered
      userId: $userId
      tags: $tags
      first: $first
      after: $after
    ) {
      ...QuestionConnectionFields
    }
  }
  ${QuestionConnectionFields}
`;

export const GET_QUESTIONS_TAGS = gql`
  query questionsTags {
    questionsTags
  }
`;

export const GET_NOTIFICATIONS = gql`
  query notifications {
    notifications {
      ...NotificationFields
    }
  }
  ${NotificationFields}
`;
