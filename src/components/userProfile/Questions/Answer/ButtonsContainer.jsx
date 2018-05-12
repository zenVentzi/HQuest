import React from 'react';
import styled from 'styled-components';

const StyledButtonsContainer = styled.div`
  margin-top: 8px;`;

const Button = styled.button`
  font-size: 15px;
  border: none;
  outline: none;
  font-family: "Arial Black", Gadget, sans-serif;
  background-color: black;
  color: white;
  border-radius: .3em;
  padding: 0.2em 0.9em;
  margin: 0.3em 0.9em;
  cursor: pointer;
  transition-duration: 0.2s;
  &:hover{
    background-color: gray;
  }
  `;

const ButtonsContainer = props => (
  <StyledButtonsContainer>
    <Button
      onClick={() => { props.onSave(); }}
    >
        Save
    </Button>
    <Button
      onClick={() => { props.onClear(); }}
    >
        Clear
    </Button>
  </StyledButtonsContainer>
);

export default ButtonsContainer;
