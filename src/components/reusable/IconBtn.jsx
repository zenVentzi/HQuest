import React from 'react';
import styled from 'styled-components';
import StyledIcon from 'Reusable/StyledIcon';
import { clickableIcon } from 'Reusable/css';

const StyledBtn = styled.div`
  ${clickableIcon};
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
`;

StyledBtn.defaultProps = {};

const Btn = React.forwardRef(({ icon, size, onClick, visible = true }, ref) => {
  return (
    <StyledBtn ref={ref} onClick={onClick} visible={visible}>
      <StyledIcon size={size} icon={icon} visible={visible} />
    </StyledBtn>
  );
});

export default Btn;
