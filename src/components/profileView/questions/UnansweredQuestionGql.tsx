import React from "react";
import { Mutation, MutationFn } from "react-apollo";
import { QUESTION_NOT_APPLY } from "GqlClient/question/mutations";
import { ADD_ANSWER } from "GqlClient/question/answer/mutations";
import {
  QuestionNotApplyMutation,
  QuestionNotApplyVariables,
  AddAnswerMutation,
  AddAnswerVariables
} from "GqlClient/autoGenTypes";

interface UnansweredQuestionGqlProps {
  children: (
    addAnswer: MutationFn<AddAnswerMutation, AddAnswerVariables>,
    questionNotApply: MutationFn<
      QuestionNotApplyMutation,
      QuestionNotApplyVariables
    >
  ) => JSX.Element;
}

const UnansweredQuestionGql = (props: UnansweredQuestionGqlProps) => {
  const { children } = props;

  return (
    <Mutation<AddAnswerMutation, AddAnswerVariables> mutation={ADD_ANSWER}>
      {addAnswer => {
        return (
          <Mutation<QuestionNotApplyMutation, QuestionNotApplyVariables>
            mutation={QUESTION_NOT_APPLY}
          >
            {questionNotApply => {
              return children(addAnswer, questionNotApply);
            }}
          </Mutation>
        );
      }}
    </Mutation>
  );
};

export default UnansweredQuestionGql;
