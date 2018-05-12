import React from 'react';
import styled from 'styled-components';

const StyledSearch = styled.input`
  padding: 0.2em 0.9em;
  font-size: 15px;
  border: none;
  border-radius: 0.2em;
  background-color: black;
  color: white;
  font-family: "Arial Black", Gadget, sans-serif;
  width: 300px;
  margin-top: 2em;`;

const Search = () => (
  <form action="#">
    <StyledSearch type="text" placeholder="Search.." name="search" />
  </form>
);

export default Search;
