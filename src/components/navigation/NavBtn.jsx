import styled from 'styled-components';

const StyledBtn = styled.button`
  font-size: 15px;
  border: none;
  outline: none;
  background-color: black;
  color: white;
  border-radius: 0.3em;
  padding: 0.2em 0.9em;
  margin-top: 0.5em;
  cursor: pointer;
  transition-duration: 0.2s;
  &:hover {
    background-color: gray;
  }
`;

export default StyledBtn;
