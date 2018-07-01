import React, { Component, Fragment } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import Scale from './Answer/Scale';
import Btn from './StyledBtn';
import { GET_QUESTIONS } from './QuestionsQuery';
import update, { ADD_QUESTION, REMOVE_QUESTION } from './CacheHelper';

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

const REMOVE_QUESTION_GQL = gql`
  mutation removeQuestion($questionId: ID!) {
    removeQuestion(questionId: $questionId) {
      id
      type
      possibleValues
      value
    }
  }
`;

const StyledQuestion = styled.div`
  /* border: 3px solid black; */
  width: 100%;
`;

class Question extends Component {
  state = {
    hovered: false,
  };

  onMouseEnter = () => {
    this.setState({ hovered: true });
  };

  onMouseLeave = () => {
    this.setState({ hovered: false });
  };

  onClickSave = mutation => async () => {
    const variables = {
      questionId: this.props.question.id,
      answerValue: this.state.value,
    };

    const isNewQuestion = !this.props.question.answer;

    const mutationParams = { variables };

    if (isNewQuestion) {
      mutationParams.update = update(this.props.userId, ADD_QUESTION);
    }

    await mutation(mutationParams);
    this.toggleViewMode();

    if (this.props.onSave) this.props.onSave();
  };

  onClickEdit = () => {
    this.toggleViewMode();
  };

  onClickRemove = mutate => async () => {
    const variables = {
      questionId: this.props.question.id,
    };

    mutate({ variables, update: update(this.props.userId, REMOVE_QUESTION) });
  };

  onChange = e => {
    const val = e.target.value;
    const newState = { ...this.state, value: val };
    this.setState(newState);
  };

  toggleViewMode = () => {
    const newState = { ...this.state };
    newState.viewMode = !this.state.viewMode;
    this.setState(newState);
  };

  render() {
    const { hovered } = this.state;

    const question = this.props.question.value;
    const { possibleValues } = this.props.question;
    const value = this.props.question.answer
      ? this.props.question.answer.value
      : null;
    const viewMode = !!this.props.question.answer;

    return (
      <StyledQuestion
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <Mutation mutation={EDIT_QUESTION}>
          {editQuestion => (
            <Mutation mutation={REMOVE_QUESTION_GQL}>
              {removeQuestion => (
                <Fragment>
                  <p> {question} </p>
                  <Scale
                    viewMode={viewMode}
                    values={possibleValues}
                    value={value}
                    onChange={this.onChange}
                  />
                  {viewMode ? (
                    <Fragment>
                      <Btn onClick={this.onClickEdit} visible={hovered}>
                        Edit
                      </Btn>
                      <Btn
                        onClick={this.onClickRemove(removeQuestion)}
                        visible={hovered}
                      >
                        Remove
                      </Btn>
                    </Fragment>
                  ) : (
                    <Btn onClick={this.onClickSave(editQuestion)}> Save </Btn>
                  )}
                </Fragment>
              )}
            </Mutation>
          )}
        </Mutation>
      </StyledQuestion>
    );
  }
}

export default Question;
