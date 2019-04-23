import gql from "graphql-tag";
import { UnansweredQuestionFields } from "GqlClient/fragments";

export const ADD_QUESTIONS = gql`
  mutation AddQuestions($questions: [InputQuestion!]) {
    addQuestions(questions: $questions)
  }
`;

export const QUESTION_NOT_APPLY = gql`
  mutation QuestionNotApply($questionId: ID!) {
    questionNotApply(questionId: $questionId) {
      ...UnansweredQuestionFields
    }
  }
  ${UnansweredQuestionFields}
`;
