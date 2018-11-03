import React from 'react';
import styled from 'styled-components';
import StyledIcon from 'Reusable/StyledIcon';
import { clickableIcon } from 'Reusable/css';

const StyledBtn = styled.div`
  ${clickableIcon};
`;

StyledBtn.defaultProps = {};

const Btn = React.forwardRef(({ icon, size, onClick, hide }, ref) => {
  return (
    <StyledBtn ref={ref} onClick={onClick}>
      <StyledIcon size={size} icon={icon} hide={hide} />
    </StyledBtn>
  );
});

export default Btn;
