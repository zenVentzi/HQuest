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

  renderValues = () => {
    const values = [];

    const onValueChange = index => e => {
      const { value } = e.target;
      const newState = { ...this.state };

      newState.possibleAnswers[index] = value;
      this.setState(newState, () => this.props.onChange(this.state));
    };

    for (let i = 0; i < 7; i++) {
      const placeholder = `${i}th value name`;
      values.push(
        <li key={i}>
          <Value placeholder={placeholder} onChange={onValueChange(i)} />
        </li>
      );
    }

    return values;
  };

  render() {
    return (
      <Fragment>
        <TextArea
          placeholder="Enter the question here.."
          onChange={e => {
            const question = e.target.value;
            const newState = { ...this.state, question };
            this.setState(newState, () => this.props.onChange(this.state));
          }}
        />
        <ol start="0">{this.renderValues()}</ol>
      </Fragment>
    );
  }
}

export default ScaleBody;
