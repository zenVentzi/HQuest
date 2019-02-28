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
