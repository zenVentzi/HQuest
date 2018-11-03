import React from 'react';
import styled, { css } from 'styled-components';
import Link from 'Reusable/UndecoratedLink';

// const StyledLink = styled(Link)`
//   ${common};
// `;

const StyledBtn = styled.div`
  display: inline-block;
  background: black;
  color: white;
  border: 2px solid white;
  border-radius: 0.3em;
  padding: 0.3em 0.8em;
  cursor: pointer;

  &:hover {
    background: white;
    color: black;
  }
`;

StyledBtn.defaultProps = {};

const Btn = React.forwardRef(({ children, className, ...mouseEvents }, ref) => {
  return (
    <StyledBtn className={className} ref={ref} onClick={mouseEvents.onClick}>
      {children}
    </StyledBtn>
  );
});

export default Btn;
