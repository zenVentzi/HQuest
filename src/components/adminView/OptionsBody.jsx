import React, { Fragment, Component } from 'react';
import styled from 'styled-components';

const StyledBtn = styled.button`
  width: 10em;
  margin: 1em;
`;

const TextArea = styled.textarea`
  margin-bottom: 1em;
  overflow: hidden;
  width: 95%;
`;

const Option = styled.input`
  margin-bottom: 1em;
  width: 10em;
`;

class OptionsBody extends Component {
  state = { question: null, possibleAnswers: [], numberOfOptions: 3 };

  onOptionChange = index => e => {
    const option = e.target.value;
    const newState = { ...this.state };

    newState.possibleAnswers[index] = option;
    this.setState(newState, () => this.props.onChange(this.state));
  };

  addOption = () => {
    this.setState(oldState => {
      const num = oldState.numberOfOptions + 1;
      return { ...oldState, numberOfOptions: num };
    });
  };

  removeOption = () => {
    this.setState(oldState => {
      const num = oldState.numberOfOptions - 1;
      return { ...oldState, numberOfOptions: num };
    });
  };

  renderOptions = () => {
    const options = [];
    const { numberOfOptions } = this.state;

    for (let i = 0; i < numberOfOptions; i++) {
      const placeholder = `option name..`;
      const option = this.state.possibleAnswers[i];
      options.push(
        <li key={i}>
          <Option
            placeholder={placeholder}
            defaultValue={option}
            onChange={this.onOptionChange(i)}
          />
        </li>
      );
    }

    return options;
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
        <ul>{this.renderOptions()}</ul>
        <div>
          <StyledBtn onClick={this.addOption}>Add option</StyledBtn>
          <StyledBtn onClick={this.removeOption}>Remove option</StyledBtn>
        </div>
      </Fragment>
    );
  }
}

export default OptionsBody;
