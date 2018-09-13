import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

const TextArea = styled.textarea`
  padding: 0.2em 0.9em;
  margin-bottom: 1em;
  resize: none;
  overflow: hidden;
  border: none;
  border-radius: 0.2em;
  background-color: black;
  color: white;
  width: 95%;
`;

const Value = styled.input`
  padding: 0.2em 0.9em;
  margin-bottom: 1em;
  border: none;
  border-radius: 0.2em;
  background-color: black;
  color: white;
  width: 10em;
`;

class ScaleBody extends Component {
  state = { question: null, possibleAnswers: [] };

  onChangePossibleAnswer = index => e => {
    const { value } = e.target;
    const newState = { ...this.state };

    newState.possibleAnswers[index] = value;
    this.setState(newState);
    this.props.onChange(newState);
  };

  onChangeDefaultAnswer = e => {
    const { value } = e.target;
    const newState = { ...this.state };
    newState.defaultAnswer = value;
    this.setState(newState);
    this.props.onChange(newState);
  };

  onChangeQuestion = ({ target: { value } }) => {
    const newState = { ...this.state, question: value };
    this.setState(newState);
    this.props.onChange(newState);
  };

  renderPossibleAnswers = () => {
    const answers = [];

    for (let i = 0; i < 7; i += 1) {
      const placeholder = `${i}th answer name`;
      answers.push(
        <li key={i}>
          <Value
            placeholder={placeholder}
            onChange={this.onChangePossibleAnswer(i)}
          />
        </li>
      );
    }

    return answers;
  };

  render() {
    return (
      <Fragment>
        <TextArea
          placeholder="Enter the question here.."
          onChange={this.onChangeQuestion}
        />
        <ol start="0">{this.renderPossibleAnswers()}</ol>
        <Value
          placeholder="Default answer(index)"
          onChange={this.onChangeDefaultAnswer}
        />
      </Fragment>
    );
  }
}

export default ScaleBody;
