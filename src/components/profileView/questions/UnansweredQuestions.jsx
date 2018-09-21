import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { ADD_ANSWER } from 'Mutations';
import UnansweredQuestion from './UnansweredQuestion';

class UnansweredQuestions extends Component {
  state = { unansweredQuestions: [] };

  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log(`derived`);
    return { unansweredQuestions: nextProps.questions };
  }

  removeFromUnanswered = questionId => {
    this.setState(prevState => {
      return {
        unansweredQuestions: prevState.unansweredQuestions.filter(
          q => q.id !== questionId
        ),
      };
    });
  };

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
    const { style } = this.props;
    const { unansweredQuestions } = this.state;

    if (!unansweredQuestions.length) {
      return <div style={style}> All questions are answered </div>;
    }

    return (
      <Mutation mutation={ADD_ANSWER}>
        {addAnswer => {
          return unansweredQuestions.map(q => (
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
