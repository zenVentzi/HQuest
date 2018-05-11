import React from 'react';
import styled from 'styled-components';
import Input from './Input';

const StyledSearch = styled.div`
  padding: initial;
  font-size: 20px;
  text-align: center;
  
  margin-top: 40px;`;

const Search = () => (
  <StyledSearch>
    <Input />
  </StyledSearch>
);

export default Search;
