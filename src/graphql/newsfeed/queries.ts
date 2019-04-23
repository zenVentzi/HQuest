import gql from "graphql-tag";
import { AnsweredQuestionFields, UserFields } from "GqlClient/fragments";

const NewAnswerEditionNewsFields = gql`
  fragment NewAnswerEditionNewsFields on NewAnswerEditionNews {
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

const NewCommentNewsFields = gql`
  fragment NewCommentNewsFields on NewCommentNews {
    performer {
      ...UserFields
    }
    answerOwner {
      ...UserFields
    }
    question {
      ...AnsweredQuestionFields
    }
    editionId
    commentId
  }
  ${UserFields}
  ${AnsweredQuestionFields}
`;

const EditionLikeNewsFields = gql`
  fragment EditionLikeNewsFields on EditionLikeNews {
    performer {
      ...UserFields
    }
    answerOwner {
      ...UserFields
    }
    question {
      ...AnsweredQuestionFields
    }
    editionId
  }
  ${UserFields}
  ${AnsweredQuestionFields}
`;

const CommentLikeNewsFields = gql`
  fragment CommentLikeNewsFields on CommentLikeNews {
    performer {
      ...UserFields
    }
    answerOwner {
      ...UserFields
    }
    question {
      ...AnsweredQuestionFields
    }
    editionId
    commentId
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
      ... on NewAnswerEditionNews {
        ...NewAnswerEditionNewsFields
      }
      ... on NewCommentNews {
        ...NewCommentNewsFields
      }
      ... on EditionLikeNews {
        ...EditionLikeNewsFields
      }
      ... on CommentLikeNews {
        ...CommentLikeNewsFields
      }
      ... on NewFollowerNews {
        ...NewFollowerNewsFields
      }
    }
  }
  ${NewAnswerEditionNewsFields}
  ${NewCommentNewsFields}
  ${EditionLikeNewsFields}
  ${CommentLikeNewsFields}
  ${NewFollowerNewsFields}
`;
