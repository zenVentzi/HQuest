import styled from 'styled-components';

const StyledBtn = styled.button`
  font-size: 15px;
  border: none;
  outline: none;
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
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

StyledBtn.defaultProps = {
  visible: true,
};

export default StyledBtn;
