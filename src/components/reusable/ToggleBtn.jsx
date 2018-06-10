import React from 'react';
import styled, { css } from 'styled-components';

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 120px;
  height: 26px;`;

const Slider = styled.div`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  transition: .4s;
  border-radius: 15px;
  
  &:before {
    position: absolute;
    content: "";
    height: 19px;
    width: 19px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 1s;
    border-radius: 50%;
  }`;

const common = css`
  color: white;
  position: absolute;
  transform: translate(-50%,-50%);
  top: 50%;
  left: 50%;
  font-size: 10px;
  // font-family: Verdana, sans-serif;`;

const On = styled.span`
  display: none;
  ${common}
`;

const Off = styled.span`
  ${common}`;

const Input = styled.input`
  display:none;
    
  &:checked + ${Slider} {
  }
  &:focus + ${Slider} {
    box-shadow: 0 0 1px #2196F3;
  }
  &:checked + ${Slider} {
    &:before {
      transform: translateX(95px);      
    }
  }
  &:checked + ${Slider} ${On} {
    display: block;
  }
  &:checked + ${Slider} ${Off} {
    display: none;
  }
`;

const ToggleBtn = (props) => {
  const test = 5;

  return (
    // eslint-disable-next-line jsx-a11y/label-has-for
    <Switch>
      <Input
        type="checkbox"
        onClick={props.onClick}
      />
      <Slider>
        <On>{props.onText}</On>
        <Off>{props.offText}</Off>
      </Slider>
    </Switch>
  );
};

export default ToggleBtn;
