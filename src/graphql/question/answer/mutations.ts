import gql from "graphql-tag";
import { QuestionFields, CommentFields, AnswerFields } from "graphql/fragments";

export const MOVE_ANSWER_POSITION = gql`
  mutation moveAnswerPosition($position: Int!, $answerId: ID!) {
    moveAnswerPosition(position: $position, answerId: $answerId)
  }
`;

export const ADD_ANSWER = gql`
  mutation addAnswer($questionId: ID!, $answerValue: String!) {
    addAnswer(questionId: $questionId, answerValue: $answerValue) {
      ...AnswerFields
    }
  }
  ${AnswerFields}
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

export const REMOVE_ANSWER = gql`
  mutation removeAnswer($answerId: ID!) {
    removeAnswer(answerId: $answerId) {
      ...AnswerFields
    }
  }
  ${AnswerFields}
`;
export const LIKE_ANSWER = gql`
  mutation likeAnswer($answerId: ID!, $userLikes: Int!) {
    likeAnswer(answerId: $answerId, userLikes: $userLikes) {
      ...AnswerFields
    }
  }
  ${AnswerFields}
`;
