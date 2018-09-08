import React from 'react';
import styled, { css } from 'styled-components';

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 120px;
  height: 26px;
`;

const Slider = styled.div`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  transition: 0.4s;
  border-radius: 15px;
  z-index: -1;

  &:before {
    position: absolute;
    z-index: -1;
    content: '';
    height: 19px;
    width: 19px;
    left: 3px;
    bottom: 3px;
    background-color: black;
    transition: 1s;
    border-radius: 50%;
  }
`;

const common = css`
  color: black;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 47%;
  font-size: 0.7em;
`;

const On = styled.span`
  display: none;
  ${common};
`;

const Off = styled.span`
  ${common};
`;

const Input = styled.input`
  display: none;

  &:focus + ${/* sc-selector */ Slider} {
    box-shadow: 0 0 1px #2196f3;
  }
  &:checked + ${/* sc-selector */ Slider} {
    &:before {
      transform: translateX(95px);
    }
  }
  &:checked + ${/* sc-selector */ Slider} ${/* sc-selector */ On} {
    display: block;
  }
  /* stylelint-disable */
  &:checked + ${/* sc-selector */ Slider} ${/* sc-selector */ Off} {
    display: none;
  }
  /* stylelint-enable */
`;

const ToggleBtn = props => {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-for
    <Switch>
      <Input type="checkbox" onClick={props.onClick} />
      <Slider>
        <On>{props.onText}</On>
        <Off>{props.offText}</Off>
      </Slider>
    </Switch>
  );
};

export default ToggleBtn;
