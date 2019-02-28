import React, { Component, Fragment, CSSProperties } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import AnswerEditor from "./Answer/AnswerEditor";
import Question from "./Question";
import UnansweredQuestionGql from "./UnansweredQuestionGql";
import { MutationFn } from "react-apollo";

const StyledQuestion = styled.div`
  width: 100%;
  border-bottom: 2px solid white;
  display: flex;
  margin-bottom: 1em;
  flex-direction: column;
  align-items: center;
`;

interface UnansweredQuestionProps {
  question: any;
  refetchQuestions: () => Promise<void>;
  style: CSSProperties;
}

class UnansweredQuestion extends Component<UnansweredQuestionProps> {
  onClickSave = (addAnswer: MutationFn) => async (answerValue: string) => {
    const { question } = this.props;

    if (!answerValue && !question.defaultAnswer) {
      toast.error("🦄 Answer not provided");
      return;
    }

    /* else if < minimumAnswerLength .toast.. */

    const variables = {
      questionId: question.id,
      answerValue
    };
    await addAnswer({ variables });
    toast.success("🦄 Answer added!");
    await this.props.refetchQuestions();
  };

  onClickDoesNotApply = (questionNotApply: MutationFn) => async () => {
    const variables = {
      questionId: this.props.question.id
    };
    await questionNotApply({ variables });
    toast.success("🦄 Does not apply? Problem solved!");
    this.props.refetchQuestions();
  };

  render() {
    const { question, style } = this.props;

    return (
      <UnansweredQuestionGql>
        {(addAnswer, questionNotApply) => (
          <StyledQuestion style={style}>
            <Question question={question.value} />
            <AnswerEditor
              onClickSave={this.onClickSave(addAnswer)}
              onClickDoesNotApply={this.onClickDoesNotApply(questionNotApply)}
              answer={question.answer}
            />
          </StyledQuestion>
        )}
      </UnansweredQuestionGql>
    );
  }
}

export default UnansweredQuestion;
