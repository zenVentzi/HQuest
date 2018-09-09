import React from 'react';
import styled from 'styled-components';
import StyledIcon from 'Reusable/StyledIcon';
import { iconBtn } from 'Reusable/css';

const StyledBtn = styled.div`
  ${iconBtn};
  display: inline-block;
`;

StyledBtn.defaultProps = {};

const Btn = React.forwardRef(({ icon, size, onClick, hide }, ref) => {
  const content = (
    <StyledIcon
      innerRef={ref}
      onClick={onClick}
      size={size}
      icon={icon}
      hide={hide}
    />
  );

  return <StyledBtn>{content}</StyledBtn>;
});

export default Btn;
