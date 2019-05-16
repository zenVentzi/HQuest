import React, { HTMLAttributes } from "react";
import styled from "styled-components";
import { clickableText, ClickableTextProps } from "Reusable/css";

// const StyledBtn = styled.div`
//   ${clickableText};
// `;

const StyledBtn = styled(
  React.forwardRef<
    HTMLDivElement,
    ClickableTextProps & HTMLAttributes<HTMLDivElement>
  >(({ color, backgroundColor, children, ...rest }, ref) => (
    <div ref={ref} {...rest}>
      {children}
    </div>
  ))
)`
  ${clickableText}
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
