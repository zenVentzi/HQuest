import gql from "graphql-tag";
import { AnsweredQuestionFields, UserFields } from "GqlClient/fragments";

const AnswerNewsFields = gql`
  fragment AnswerNewsFields on AnswerNews {
    performer {
      ...UserFields
    }
    question {
      ...AnsweredQuestionFields
    }
  }
  ${UserFields}
  ${AnsweredQuestionFields}
`;

const CommentNewsFields = gql`
  fragment CommentNewsFields on CommentNews {
    performer {
      ...UserFields
    }
    answerOwner {
      ...UserFields
    }
    question {
      ...AnsweredQuestionFields
    }
    commentId
  }
  ${UserFields}
  ${AnsweredQuestionFields}
`;

const NewLikeNewsFields = gql`
  fragment NewLikeNewsFields on NewLikeNews {
    performer {
      ...UserFields
    }
    answerOwner {
      ...UserFields
    }
    question {
      ...AnsweredQuestionFields
    }
  }
  ${UserFields}
  ${AnsweredQuestionFields}
`;

const NewFollowerNewsFields = gql`
  fragment NewFollowerNewsFields on NewFollowerNews {
    performer {
      ...UserFields
    }
    followedUser {
      ...UserFields
    }
  }
  ${UserFields}
`;

export const GET_NEWSFEED = gql`
  query newsfeed {
    newsfeed {
      type
      createdOn
      ... on AnswerNews {
        ...AnswerNewsFields
      }
      ... on CommentNews {
        ...CommentNewsFields
      }
      ... on NewLikeNews {
        ...NewLikeNewsFields
      }
      ... on NewFollowerNews {
        ...NewFollowerNewsFields
      }
    }
  }
  ${AnswerNewsFields}
  ${CommentNewsFields}
  ${NewLikeNewsFields}
  ${NewFollowerNewsFields}
`;
