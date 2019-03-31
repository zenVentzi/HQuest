import React, { CSSProperties } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import AnswerEditor from "./Answer/AnswerEditor";
import Question from "./Question";
import UnansweredQuestionGql from "./UnansweredQuestionGql";
import { MutationFn } from "react-apollo";
import {
  AddAnswerMutation,
  AddAnswerMutationVariables,
  QuestionNotApplyMutation,
  QuestionNotApplyMutationVariables,
  QuestionFieldsFragment
} from "GqlClient/autoGenTypes";

const StyledQuestion = styled.div`
  width: 100%;
  border-bottom: 2px solid white;
  display: flex;
  margin-bottom: 1em;
  flex-direction: column;
  align-items: center;
`;

interface UnansweredQuestionProps {
  question: QuestionFieldsFragment;
  refetchQuestions: () => Promise<void>;
  style?: CSSProperties;
}

const UnansweredQuestion = ({
  question,
  refetchQuestions,
  style
}: UnansweredQuestionProps) => {
  const onClickSave = (
    addAnswer: MutationFn<AddAnswerMutation, AddAnswerMutationVariables>
  ) => async (answerValue: string) => {
    if (!answerValue) {
      toast.error("Answer not provided");
      return;
    }

    /* else if < minimumAnswerLength .toast.. */

    const variables = {
      questionId: question.id,
      answerValue
    };
    await addAnswer({ variables });
    toast.success("🦄 Answer added!");
    await refetchQuestions();
  };

  const onClickDoesNotApply = (
    questionNotApply: MutationFn<
      QuestionNotApplyMutation,
      QuestionNotApplyMutationVariables
    >
  ) => async () => {
    const variables = {
      questionId: question.id
    };
    await questionNotApply({ variables });
    toast.success("🦄 Does not apply? Problem solved!");
    refetchQuestions();
  };

  return (
    <UnansweredQuestionGql>
      {(addAnswer, questionNotApply) => (
        <StyledQuestion style={style}>
          <Question question={question.value} />
          <AnswerEditor
            onClickSave={onClickSave(addAnswer)}
            onClickDoesNotApply={onClickDoesNotApply(questionNotApply)}
            answer={question.answer}
          />
        </StyledQuestion>
      )}
    </UnansweredQuestionGql>
  );
};

export default UnansweredQuestion;
