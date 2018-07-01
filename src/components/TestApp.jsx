import React, { Fragment } from 'react';
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

const App = () => {
  const test = 5;

  return (
    <Slider
      // disabled={viewMode}
      type="range"
      min={0}
      max={6}
      defaultValue={3}
    />
  );
};

export default App;
