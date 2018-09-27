import React, { Component, Fragment } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import UnansweredQuestionsGql from './UnansweredQuestionsGql';
import UnansweredQuestion from './UnansweredQuestion';

class UnansweredQuestions extends Component {
  onClickSave = ({ addAnswer, questionId }) => async ({ answerValue }) => {
    const variables = {
      questionId,
      answerValue,
    };
    await addAnswer({ variables });
    toast.success('🦄 Answer added!');
    this.props.refetch();
  };

  onDoesNotApply = ({ questionNotApply, questionId }) => async () => {
    const variables = {
      questionId,
    };
    await questionNotApply({ variables });
    toast.success('🦄 Does not apply? Problem solved!');
    this.props.refetch();
  };

  render() {
    const { style, questions } = this.props;

    if (!questions.length) {
      return <div style={style}> All questions are answered </div>;
    }

    return (
      <UnansweredQuestionsGql>
        {(addAnswer, questionNotApply) => {
          return questions.map(q => (
            <UnansweredQuestion
              key={q.id}
              style={style}
              question={q}
              onClickSave={this.onClickSave({
                addAnswer,
                questionId: q.id,
              })}
              onDoesNotApply={this.onDoesNotApply({
                questionNotApply,
                questionId: q.id,
              })}
            />
          ));
        }}
      </UnansweredQuestionsGql>
    );
  }
}

export default UnansweredQuestions;
