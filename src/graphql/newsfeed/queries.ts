import gql from "graphql-tag";
import { QuestionFields, UserFields } from "GqlClient/fragments";

const AnswerNewsFields = gql`
  fragment AnswerNewsFields on AnswerNews {
    performer {
      ...UserFields
    }
    question {
      ...QuestionFields
    }
  }
  ${UserFields}
  ${QuestionFields}
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
      ...QuestionFields
    }
    commentId
  }
  ${UserFields}
  ${QuestionFields}
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
      ...QuestionFields
    }
  }
  ${UserFields}
  ${QuestionFields}
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
  ${QuestionFields}
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
  ${UserFields}
  ${QuestionFields}
  ${AnswerNewsFields}
  ${CommentNewsFields}
  ${NewLikeNewsFields}
  ${NewFollowerNewsFields}
`;
