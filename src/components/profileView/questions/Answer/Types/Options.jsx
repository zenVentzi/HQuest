import React, { Component } from 'react';
import styled from 'styled-components';

const Viwer = styled.div`
  word-wrap: break-word;
  max-width: 80%;
  background: black;
  color: white;
  border-radius: 0.2em;
  padding: 0.2em 4em;
`;

const Select = styled.select`
  text-align: center;
  max-width: 80%;
  text-align-last: center;
  background-color: black;
  border-radius: 0.5em;
  color: white;
`;

const DEFAULT_OPTION = 'default';

class Options extends Component {
  // state = { editedValue: null };

  onChange = e => {
    const selectedOption = e.target.value;

    this.props.onChange(selectedOption);
  };

  renderOptions = () => {
    const result = [
      <option key={DEFAULT_OPTION} value={DEFAULT_OPTION} disabled>
        Select an option
      </option>,
    ];

    this.props.options.forEach(opt =>
      result.push(
        <option key={opt} value={opt}>
          {opt}
        </option>
      )
    );

    return result;
  };

  render() {
    const { viewMode, option } = this.props;

    if (viewMode) {
      return <Viwer>{option}</Viwer>;
    }

    const defaultOption = option || DEFAULT_OPTION;

    return (
      <Select defaultValue={defaultOption} onChange={this.onChange}>
        {this.renderOptions()}
      </Select>
    );
  }
}

export default Options;
