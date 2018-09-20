import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { ADD_ANSWER } from 'Mutations';
import UnansweredQuestion from './UnansweredQuestion';

class UnansweredQuestions extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  /* when to fetch more? When the last question is visible */
  onAddAnswer = addAnswer => async ({ questionId, answerValue }) => {
    const variables = {
      questionId,
      answerValue,
    };
    const res = await addAnswer({ variables });
    return res;
  };

  onDoesNotApply = () => {};

  render() {
    const {
      style,
      questions: { edges },
    } = this.props;

    if (!edges.length) {
      return <div style={style}> All questions are answered </div>;
    }

    return (
      <Mutation mutation={ADD_ANSWER}>
        {addAnswer => {
          return edges.map(e => (
            <UnansweredQuestion
              key={e.cursor}
              style={style}
              question={e.node}
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
