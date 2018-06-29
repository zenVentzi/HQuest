import React, { Component, Fragment } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import Scale from './Answer/Scale';
import Btn from './StyledBtn';

const EDIT_ANSWER = gql`
  mutation editAnswer($value: String!, $questionId: ID!) {
    editAnswer(value: $value, questionId: $questionId)
  }
`;

const StyledQuestion = styled.div`
  /* border: 3px solid black; */
  width: 100%;
`;

const EditBtn = props => (
  <Btn
    onClick={() => {
      props.onEdit();
    }}
    visible={props.visible}
  >
    Edit
  </Btn>
);

const RemoveBtn = props => (
  <Btn
    onClick={() => {
      props.onRemove();
    }}
    visible={props.visible}
  >
    Remove
  </Btn>
);

const SaveBtn = props => (
  <Btn
    onClick={() => {
      props.onSave();
    }}
  >
    Save
  </Btn>
);
class Question extends Component {
  state = {
    hovered: false,
    question: this.props.question.value,
    possibleValues: this.props.question.possibleValues,
    value: this.props.question.answer ? this.props.question.answer.value : null,
    viewMode: !!this.props.question.answer,
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextState.value !== this.state.value) return false;
  //   return true;
  // }

  onMouseEnter = () => {
    this.setState({ hovered: true });
  };

  onMouseLeave = () => {
    this.setState({ hovered: false });
  };

  onChange = value => {
    const newState = { ...this.state, value };
    this.setState(newState);
  };

  onSave = editAnswer => async () => {
    const variables = {
      value: this.state.value,
      userId: this.props.userId,
      questionId: this.props.question.id,
    };

    console.log(variables);

    const t = await editAnswer({ variables });
    console.log(t);
    this.toggleViewMode();

    if (this.props.onSave) this.props.onSave();
  };

  onEdit = () => {
    this.toggleViewMode();
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
          {(editAnswer, { data }) => (
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
                  <EditBtn onEdit={this.onEdit} visible={hovered} />
                  <RemoveBtn
                    onEdit={this.onRemove}
                    visible={this.state.hovered}
                  />
                </Fragment>
              ) : (
                <SaveBtn onSave={this.onSave(editAnswer)} />
              )}
            </Fragment>
          )}
        </Mutation>
      </StyledQuestion>
    );
  }
}

export default Question;
