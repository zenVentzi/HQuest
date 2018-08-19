import React, { Component, Fragment } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Btn from './StyledBtn';
import Answer from './Answer';
import QuestionText from './QuestionText';
import update, { CACHE_ACTIONS } from './CacheHelper';

const EDIT_ANSWER = gql`
  mutation editAnswer($answerId: ID!, $answerValue: String!) {
    editAnswer(answerId: $answerId, answerValue: $answerValue) {
      id
      userId
      questionId
      value
    }
  }
`;

const ADD_ANSWER = gql`
  mutation addAnswer($questionId: ID!, $answerValue: String!) {
    addAnswer(questionId: $questionId, answerValue: $answerValue) {
      id
      userId
      questionId
      value
    }
  }
`;

const DEFAULT_ANSWER = 3;

class QuestionEditor extends Component {
  state = {
    answerValue: this.props.question.answer
      ? this.props.question.answer.value
      : DEFAULT_ANSWER,
  };

  onClickSave = mutation => async () => {
    const mutationParams = {};

    const isNewQuestion = !this.props.question.answer;
    const variables = {
      answerValue: this.state.answerValue,
    };

    if (isNewQuestion) {
      variables.questionId = this.props.question.id;
      mutationParams.update = update(CACHE_ACTIONS.ADD_ANSWER);
    } else {
      // mutationParams.update = update(CACHE_ACTIONS.EDIT_ANSWER);
      variables.answerId = this.props.question.answer.id;
    }

    mutationParams.variables = variables;

    await mutation(mutationParams);
    if (this.props.onSaved) this.props.onSaved();
  };

  onChange = e => {
    const { value } = e.target;
    const newState = { ...this.state, answerValue: value };
    this.setState(newState);
  };

  render() {
    const gqlMutation = this.props.question.answer ? EDIT_ANSWER : ADD_ANSWER;
    return (
      <Mutation mutation={gqlMutation}>
        {mutation => {
          const { question } = this.props;
          // const { possibleAnswers } = question;
          // const { answerValue } = this.state;

          return (
            <Fragment>
              <QuestionText> {question.question} </QuestionText>
              <Answer
                viewMode={false}
                question={question}
                onChange={this.onChange}
              />
              <Btn onClick={this.onClickSave(mutation)}> Save </Btn>
            </Fragment>
          );
        }}
      </Mutation>
    );
  }
}

export default QuestionEditor;
