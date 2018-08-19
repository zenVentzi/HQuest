import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 80%;
  background: black;
  color: white;
  border-radius: 0.2em;
  padding: 0.2em 1em;
`;

const Slider = styled.input`
  appearance: none;
  display: block;
  margin: 0 auto;
  width: 50%;
  height: 15px;
  border-radius: 5px;
  background: white;
  outline: none;
  transition: opacity 0.2s;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: black;
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: black;
    cursor: pointer;
  }
  &:hover {
    opacity: 0.9;
  }
`;

const DEFAULT_VALUE = 3;

class Scale extends Component {
  state = { editedValue: null };

  onChange = e => {
    const editedValue = e.target.value;
    this.setState({ editedValue });
    this.props.onChange(editedValue);
  };

  render() {
    const { viewMode, value, values } = this.props;
    const defaultValue = value || DEFAULT_VALUE;
    const minValue = 0;
    const maxValue = values.length - 1;

    const currentValue = this.state.editedValue || defaultValue;

    const valueName = values[currentValue];

    return (
      <Wrapper>
        <p> {valueName} </p>
        <Slider
          disabled={viewMode}
          type="range"
          min={minValue}
          max={maxValue}
          defaultValue={defaultValue}
          onChange={this.onChange}
        />
      </Wrapper>
    );
  }
}

export default Scale;
