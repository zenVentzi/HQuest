import React, { Component, Fragment } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Btn from './StyledBtn';
import Scale from './Answer/Scale';
import update, { ADD_QUESTION } from './CacheHelper';

const EDIT_QUESTION = gql`
  mutation editQuestion($questionId: ID!, $answerValue: String!) {
    editQuestion(questionId: $questionId, answerValue: $answerValue) {
      id
      type
      possibleValues
      value
      answer {
        id
        value
      }
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
    const variables = {
      questionId: this.props.question.id,
      answerValue: this.state.answerValue,
    };

    const isNewQuestion = !this.props.question.answer;

    const mutationParams = { variables };

    if (isNewQuestion) {
      mutationParams.update = update(ADD_QUESTION);
    }

    await mutation(mutationParams);
    if (this.props.onSaved) this.props.onSaved();
  };

  onChange = e => {
    const { value } = e.target;
    const newState = { ...this.state, answerValue: value };
    this.setState(newState);
  };

  render() {
    return (
      <Mutation mutation={EDIT_QUESTION}>
        {editQuestion => {
          const question = this.props.question.value;
          const values = this.props.question.possibleValues;
          const { answerValue } = this.state;

          return (
            <Fragment>
              <p> {question} </p>
              <Scale
                values={values}
                value={answerValue}
                onChange={this.onChange}
              />
              <Btn onClick={this.onClickSave(editQuestion)}> Save </Btn>
            </Fragment>
          );
        }}
      </Mutation>
    );
  }
}

export default QuestionEditor;
