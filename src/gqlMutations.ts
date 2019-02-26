import gql from 'graphql-tag';
import { QuestionFields, CommentFields, AnswerFields } from 'Fragments';

// remember to remove
export const AUTH_TOKEN = 'AUTH_TOKEN';
export const USER_ID = `USER_ID`;

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $name: String!) {
    login(email: $email, name: $name) {
      authToken
      userId
    }
  }
`;
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

export const ADD_QUESTIONS = gql`
  mutation AddQuestionsMutation($questions: [InputQuestion!]) {
    addQuestions(questions: $questions)
  }
`;
export const MOVE_ANSWER_POSITION = gql`
  mutation moveAnswerPosition($position: Int!, $answerId: ID!) {
    moveAnswerPosition(position: $position, answerId: $answerId)
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

// TODO return either Answer or Comment
export const COMMENT_ANSWER = gql`
  mutation commentAnswer($answerId: ID!, $comment: String!) {
    commentAnswer(answerId: $answerId, comment: $comment) {
      ...CommentFields
    }
  }
  ${CommentFields}
`;

export const EDIT_COMMENT = gql`
  mutation editComment(
    $answerId: ID!
    $commentId: ID!
    $commentValue: String!
  ) {
    editComment(
      answerId: $answerId
      commentId: $commentId
      commentValue: $commentValue
    ) {
      ...CommentFields
    }
  }
  ${CommentFields}
`;

export const REMOVE_COMMENT = gql`
  mutation removeComment($answerId: ID!, $commentId: ID!) {
    removeComment(answerId: $answerId, commentId: $commentId) {
      ...CommentFields
    }
  }
  ${CommentFields}
`;

export const ADD_ANSWER = gql`
  mutation addAnswer($questionId: ID!, $answerValue: String!) {
    addAnswer(questionId: $questionId, answerValue: $answerValue) {
      ...AnswerFields
    }
  }
  ${AnswerFields}
`;

export const QUESTION_NOT_APPLY = gql`
  mutation questionNotApply($questionId: ID!) {
    questionNotApply(questionId: $questionId) {
      ...QuestionFields
    }
  }
  ${QuestionFields}
`;