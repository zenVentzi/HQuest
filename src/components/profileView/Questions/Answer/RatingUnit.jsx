import React from 'react';
import styled, { css } from 'styled-components';
import tickBlack from './tick_black.png';
import tickWhite from './tick_white.png';

const StyledRatingUnit = styled.button`${props => css`
  width: 30px;
  height: 30px;
  outline: none;
  margin-left: 5px;
  border-radius: 50%;
  
  background-size:contain;
  background-position: center;
  background-repeat:no-repeat;
  background-image:url(${props.active ? tickWhite : tickBlack});
  background-color: ${props.active ? 'black' : 'white'};
  pointer-events: ${props.editMode ? 'auto' : 'none'};
  cursor: ${props.editMode ? 'pointer' : 'default'};
  `}`;

const RatingUnit = props => (
  <StyledRatingUnit
    active={props.active}
    editMode={props.editMode}
    onClick={() => { props.clickHandler(props.index); }}
  />
);

export default RatingUnit;
