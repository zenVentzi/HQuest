import React, { Component } from 'react';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  width: 80%;
  background: black;
  color: white;
  text-align: center;
  border-radius: 0.2em;
  padding: 0.2em 0.2em;
  margin-bottom: 0.3em;
`;

const Slider = styled.input`
  appearance: none;
  display: block;
  margin: 0 auto;
  width: 50%;
  height: 1.5em;
  border-radius: 5px;
  background: white;
  outline: none;
  transition: opacity 0.1s;
  cursor: ${props => (props.clickable ? 'pointer' : 'default')};

  &::-webkit-slider-thumb {
    appearance: none;
    width: 1.3em;
    height: 1.3em;
    border-radius: 50%;
    background: black;
  }
  &:hover {
    opacity: 0.9;
  }
`;

const ValueName = styled.p`
  margin-bottom: 0.3em;
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
        <ValueName> {valueName} </ValueName>
        <Slider
          disabled={viewMode}
          clickable={!viewMode}
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
