import gql from 'graphql-tag';
import { QuestionFields, CommentFields } from 'Fragments';

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

export const CREATE_QUESTION_MUTATION = gql`
  mutation CreateQuestionMutation(
    $question: String!
    $type: QuestionType!
    $defaultAnswer: Int
    $possibleAnswers: [String!]
    $tags: [String!]!
  ) {
    createQuestion(
      question: $question
      type: $type
      defaultAnswer: $defaultAnswer
      possibleAnswers: $possibleAnswers
      tags: $tags
    )
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

export const REMOVE_ANSWER = gql`
  mutation removeAnswer($answerId: ID!) {
    removeAnswer(answerId: $answerId) {
      userId
      questionId
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

export const QUESTION_NOT_APPLY = gql`
  mutation questionNotApply($questionId: ID!) {
    questionNotApply(questionId: $questionId) {
      ...QuestionFields
    }
  }
  ${QuestionFields}
`;

// export const ADD_COMMENT = gql`
//   mutation addComment($answerId: ID!, $comment: String!) {
//     addComment(answerId: $answerId, comment: $comment) {
//       ...CommentFields
//   }
//   ${CommentFields}
// `;
