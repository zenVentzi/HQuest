import React, { Component, Fragment } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { ADD_ANSWER } from 'Mutations';
import UnansweredQuestion from './UnansweredQuestion';

class UnansweredQuestions extends Component {
  onAddAnswer = addAnswer => async ({ questionId, answerValue }) => {
    const variables = {
      questionId,
      answerValue,
    };
    await addAnswer({ variables });
    toast.success('🦄 Answer added!');
    this.props.refetch();
  };

  onDoesNotApply = () => {};

  render() {
    const { style, questions } = this.props;

    if (!questions.length) {
      return <div style={style}> All questions are answered </div>;
    }

    return (
      <Mutation mutation={ADD_ANSWER}>
        {addAnswer => {
          return questions.map(q => (
            <UnansweredQuestion
              key={q.id}
              style={style}
              question={q}
              onAddAnswer={this.onAddAnswer(addAnswer)}
              onDoesNotApply={this.onDoesNotApply}
            />
          ));
        }}
      </Mutation>
    );
  }
}

export default UnansweredQuestions;
