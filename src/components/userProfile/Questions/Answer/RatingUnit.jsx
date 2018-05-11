import React from 'react';
import styled from 'styled-components';

const StyledRatingUnit = styled.button`
  width: 30px;
  height: 30px;
  margin-left: 5px;
  vertical-align: middle; 
  background-color: ${props =>
    (props.active ? 'black' : 'white')};`;

const RatingUnit = props => (
  <StyledRatingUnit
    active={props.active}
    onClick={() => { props.clickHandler(props.id); }}
  />
);

export default RatingUnit;
