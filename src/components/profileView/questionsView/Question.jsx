import React, { Component, Fragment } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import Scale from './Answer/Scale';
import Btn from './StyledBtn';
import { GET_QUESTIONS } from './QuestionsQuery';
import update, { ADD_QUESTION, REMOVE_QUESTION } from './CacheHelper';

const EDIT_ANSWER = gql`
  mutation editAnswer($value: String!, $questionId: ID!) {
    editAnswer(value: $value, questionId: $questionId)
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
    question: this.props.question.value,
    possibleValues: this.props.question.possibleValues,
    value: this.props.question.answer ? this.props.question.answer.value : null,
    viewMode: !!this.props.question.answer,
  };

  onMouseEnter = () => {
    this.setState({ hovered: true });
  };

  onMouseLeave = () => {
    this.setState({ hovered: false });
  };

  onSave = mutation => async () => {
    const variables = {
      value: this.state.value,
      userId: this.props.userId,
      questionId: this.props.question.id,
    };

    const isNewQuestion = !this.props.question.answer;

    const mutationParams = { variables };

    if (isNewQuestion) {
      mutationParams.update = () => {};
    }

    await mutation(mutationParams);
    this.toggleViewMode();

    if (this.props.onSave) this.props.onSave();
  };

  onEdit = () => {
    this.toggleViewMode();
  };

  onRemove = mutate => async () => {
    const variables = {
      questionId: this.props.question.id,
    };

    // const updateQuestions = (answered, store, returnedValue) => {
    //   const { userId } = this.props;
    //   const { questions } = store.readQuery({
    //     query: GET_QUESTIONS,
    //     variables: { userId, answered },
    //   });

    //   if (answered) {
    //     const removedQuestionId = returnedValue.id;
    //     const i = questions.findIndex(q => q.id === removedQuestionId);
    //     questions.splice(i, 1);
    //   } else {
    //     questions.push(returnedValue);
    //   }

    //   store.writeQuery({
    //     query: GET_QUESTIONS,
    //     variables: { userId, answered },
    //     data: { questions },
    //   });
    // };

    // const update = (store, { data: { removeQuestion } }) => {
    //   try {
    //     updateQuestions(false, store, removeQuestion);
    //   } catch (error) {} // eslint-disable-line no-empty

    //   updateQuestions(true, store, removeQuestion);
    // };

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
    const { hovered, question, possibleValues, value, viewMode } = this.state;

    // console.log(value);

    return (
      <StyledQuestion
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <Mutation mutation={EDIT_ANSWER}>
          {editAnswer => (
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
                  {this.state.viewMode ? (
                    <Fragment>
                      <Btn onClick={this.onEdit} visible={hovered}>
                        Edit
                      </Btn>
                      <Btn
                        onClick={this.onRemove(removeQuestion)}
                        visible={this.state.hovered}
                      >
                        Remove
                      </Btn>
                    </Fragment>
                  ) : (
                    <Btn onClick={this.onSave(editAnswer)}> Save </Btn>
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
