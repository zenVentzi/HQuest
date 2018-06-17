import React, { Fragment } from 'react';
import styled from 'styled-components';

const StyledView = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 70px auto;
  align-items: center;
  text-align: center;
  width: 500px;
  border: 3px solid red;
  overflow: hidden;
`;

const StyledAnswer = styled.div`
  margin-top: 0.5em;
  border: 1px solid black;
`;

const Slider = styled.input`
  appearance: none;
  display: block;
  width: 50%;
  height: 15px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4caf50;
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4caf50;
    cursor: pointer;
  }
  &:hover {
    opacity: 1;
  }
`;

const App = () => {
  const test = 5;

  return (
    <StyledView>
      <StyledAnswer>
        <Slider type="range" min="0" max="6" defaultValue={6} />
      </StyledAnswer>
    </StyledView>
  );
};

export default App;
