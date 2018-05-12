import React from 'react';
import styled from 'styled-components';
import style from './test.css';

const StyledRatingUnit = styled.button`
  width: 30px;
  height: 30px;
  outline: none;
  margin-left: 5px;
  border-radius: 50%;
  // background-image:url("tick.png");
  background-position: center;
  background-repeat:no-repeat;
  background-color: ${props =>
    (props.active ? 'black' : 'white')};`;

const RatingUnit = props => (
  <StyledRatingUnit
    active={props.active}
    onClick={() => { props.clickHandler(props.id); }}
  />
);

export default RatingUnit;
