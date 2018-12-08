import React from 'react';
import styled from 'styled-components';
import { clickableText } from 'Reusable/css';

const StyledBtn = styled.div`
  ${clickableText};
`;

StyledBtn.defaultProps = {};

export default StyledBtn;

// TODO export directly the stlyed comp
// const Btn = React.forwardRef(({ children, className, ...mouseEvents }, ref) => {
//   return (
//     <StyledBtn className={className} ref={ref} onClick={mouseEvents.onClick}>
//       {children}
//     </StyledBtn>
//   );
// });

// export default Btn;
