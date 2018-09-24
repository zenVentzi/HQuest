import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { ADD_ANSWER, QUESTION_NOT_APPLY } from 'Mutations';

class AnsweredQuestionsGql extends Component {
  render() {
    const { children } = this.props;

    return (
      <Mutation mutation={ADD_ANSWER}>
        {addAnswer => {
          return (
            <Mutation mutation={QUESTION_NOT_APPLY}>
              {questionNotApply => {
                return children(addAnswer, questionNotApply);
              }}
            </Mutation>
          );
        }}
      </Mutation>
    );
  }
}

export default AnsweredQuestionsGql;
