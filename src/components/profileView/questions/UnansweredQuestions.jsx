import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { ADD_ANSWER } from 'Mutations';
import UnansweredQuestion from './UnansweredQuestion';

class UnansweredQuestions extends Component {
  constructor(props) {
    super(props);

    const { edges } = this.props.questions;
    this.currentIndex = 0;
    let currentQuestion;
    if (edges.length) {
      currentQuestion = edges[this.currentIndex];
    }

    this.state = { currentQuestion };
  }

  // *questionsGen() {
  //   yield* this.props.questions;
  // }

  onNextQuestionSet = async () => {
    const { edges } = this.props.questions;
    const {
      pageInfo: { hasNextPage },
    } = this.props;
    const isAtTheEnd = this.currentIndex >= edges.length - 1;

    console.log(
      'TCL: UnansweredQuestions -> onNextQuestionSet -> hasNextPage',
      hasNextPage
    );

    if (isAtTheEnd && hasNextPage) {
      const lastEdgeCursor = edges[edges.length - 1].cursor;
      const after = lastEdgeCursor;

      await this.props.fetchMore({
        variables: { after },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          console.log(`unansweredqs : ${fetchMoreResult.questions}`);

          return {
            ...prev,
            questions: [...prev.questions, ...fetchMoreResult.questions],
          };
        },
      });
    }
  };

  setNextQuestion = async () => {
    const { edges } = this.props.questions;

    this.setState(
      prevState => {
        this.currentIndex += 1;

        const currentQuestion = edges[this.currentIndex].node;
        return { ...prevState, currentQuestion };
      },
      () => {
        this.onNextQuestionSet();
      }
    );
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
          const { edges } = this.props.questions;

          return edges.map(e => (
            <UnansweredQuestion
              key={e.cursor}
              style={style}
              question={e.node}
              onAdd={this.onAddAnswer(addAnswer)}
              onNext={this.onNext}
              onDoesNotApply={this.onDoesNotApply}
            />
          ));
        }}
      </Mutation>
    );
  }
}

export default UnansweredQuestions;
