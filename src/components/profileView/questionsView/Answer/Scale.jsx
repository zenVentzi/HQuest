import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

const Slider = styled.input`
  appearance: none;
  display: block;
  margin: 0 auto;
  width: 50%;
  height: 15px;
  border-radius: 5px;
  background: black;
  outline: none;
  transition: opacity 0.2s;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
  }
  &:hover {
    opacity: 0.9;
  }
`;

class Scale extends Component {
  constructor(props) {
    super(props);
    const valueName = this.props.values[this.props.value];
    this.state = {
      disabled: !this.props.editMode,
      defaultValue: this.props.editMode ? this.props.value : undefined,
      minValue: 0,
      maxValue: this.props.values.length - 1,
      valueName,
    };
  }
  onChange = e => {
    const val = e.target.value;
    const valueName = this.props.values[val];
    this.setState({ valueName });
    // this.props.onChange(val);
  };

  render() {
    return (
      <Fragment>
        <p> {this.state.valueName} </p>
        <Slider
          disabled={this.state.disabled}
          type="range"
          min={this.state.minValue}
          max={this.state.maxValue}
          defaultValue={this.state.defaultValue}
          onChange={this.onChange}
        />
      </Fragment>
    );
  }
}

export default Scale;
