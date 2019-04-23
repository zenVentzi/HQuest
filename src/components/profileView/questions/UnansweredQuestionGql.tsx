import React from "react";
import { Mutation, MutationFn } from "react-apollo";
import { QUESTION_NOT_APPLY } from "GqlClient/question/mutations";
import { ADD_ANSWER } from "GqlClient/question/answer/mutations";
import {
  QuestionNotApplyMutation,
  QuestionNotApplyMutationVariables,
  AddAnswerMutation,
  AddAnswerMutationVariables
} from "GqlClient/autoGenTypes";

interface UnansweredQuestionGqlProps {
  children: (
    addAnswer: MutationFn<AddAnswerMutation, AddAnswerMutationVariables>,
    questionNotApply: MutationFn<
      QuestionNotApplyMutation,
      QuestionNotApplyMutationVariables
    >
  ) => JSX.Element;
}

const UnansweredQuestionGql = (props: UnansweredQuestionGqlProps) => {
  const { children } = props;

  return (
    <Mutation<AddAnswerMutation, AddAnswerMutationVariables>
      mutation={ADD_ANSWER}
    >
      {addAnswer => {
        return (
          <Mutation<QuestionNotApplyMutation, QuestionNotApplyMutationVariables>
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
