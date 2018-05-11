import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  padding: 6px;
  font-size: 15px;
  border: none;
  border-radius: 3%;
  background-color: black;
  color: white;
  font-family: "Arial Black", Gadget, sans-serif;`;

const Input = () => (
  <form action="#">
    <StyledInput type="text" placeholder="Search.." name="search" />
  </form>
);

export default Input;
