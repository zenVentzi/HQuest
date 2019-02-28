import gql from "graphql-tag";
import { QuestionFields, CommentFields, AnswerFields } from "graphql/fragments";

export const ADD_QUESTIONS = gql`
  mutation AddQuestionsMutation($questions: [InputQuestion!]) {
    addQuestions(questions: $questions)
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
