import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { ADD_ANSWER } from 'Mutations';
import UnansweredQuestion from './UnansweredQuestion';

class UnansweredQuestions extends Component {
  currentIndex = 0;
  state = { currentQuestion: this.props.questions[this.currentIndex] };

  // *questionsGen() {
  //   yield* this.props.questions;
  // }

  setNextQuestion = () => {
    this.setState((prevState, props) => {
      this.currentIndex += 1;

      const currentQuestion = props.questions[this.currentIndex];
      return { ...prevState, currentQuestion };
    });
  };

  onAddAnswer = addAnswer => async answerValue => {
    const { currentQuestion } = this.state;

    const { defaultAnswer } = currentQuestion;
    const variables = {
      questionId: currentQuestion.id,
      answerValue: answerValue || defaultAnswer,
    };
    await addAnswer({ variables });
    this.setNextQuestion();
  };

  onNext = () => {};
  onDoesNotApply = () => {};

  render() {
    const { style } = this.props;
    const { currentQuestion } = this.state;

    if (!currentQuestion) {
      return <div style={style}> Congrats. All questions are answered </div>;
    }

    return (
      <Mutation mutation={ADD_ANSWER}>
        {addAnswer => {
          return (
            <Fragment>
              <UnansweredQuestion
                style={style}
                question={currentQuestion}
                onAdd={this.onAddAnswer(addAnswer)}
                onNext={this.onNext}
                onDoesNotApply={this.onDoesNotApply}
              />
            </Fragment>
          );
        }}
      </Mutation>
    );
  }
}

export default UnansweredQuestions;
