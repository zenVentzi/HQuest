import styled from 'styled-components';

export default styled.button`
  font-size: 15px;
  border: none;
  outline: none;
  font-family: 'Arial Black', Gadget, sans-serif;
  background-color: black;
  color: white;
  border-radius: 0.3em;
  padding: 0.2em 0.9em;
  margin: 1em 0.9em;
  cursor: pointer;
  transition-duration: 0.2s;
  &:hover {
    background-color: gray;
  }
`;
