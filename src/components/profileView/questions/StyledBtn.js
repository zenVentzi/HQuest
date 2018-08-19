import styled from 'styled-components';

const StyledBtn = styled.button`
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  margin: 0.2em 0.4em;
  /* margin: 1em 0.9em; */
`;

StyledBtn.defaultProps = {
  visible: true,
};

export default StyledBtn;
