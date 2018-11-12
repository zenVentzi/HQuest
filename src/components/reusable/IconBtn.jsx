import React from 'react';
import styled from 'styled-components';
import StyledIcon from 'Reusable/StyledIcon';
import { clickableIcon } from 'Reusable/css';

const StyledBtn = styled.div`
  ${clickableIcon};
`;

StyledBtn.defaultProps = {};

const Btn = React.forwardRef(
  ({ icon, size, onClick, reverseColor = false, visible = true }, ref) => {
    return (
      <StyledBtn
        role="button"
        ref={ref}
        onClick={onClick}
        reverseColor={reverseColor}
        visible={visible}
      >
        <StyledIcon size={size} icon={icon} visible={visible} />
      </StyledBtn>
    );
  }
);

export default Btn;
