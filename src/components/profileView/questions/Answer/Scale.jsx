import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 0.6em;
`;

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

const Scale = props => {
  const { viewMode, value } = props;
  const minValue = 0;
  const maxValue = props.values.length - 1;
  const valueName = props.values[value];

  return (
    <Wrapper>
      <p> {valueName} </p>
      <Slider
        disabled={viewMode}
        type="range"
        min={minValue}
        max={maxValue}
        defaultValue={value}
        onChange={props.onChange}
      />
    </Wrapper>
  );
};

export default Scale;
