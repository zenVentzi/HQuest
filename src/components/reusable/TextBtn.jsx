import React from 'react';
import styled, { css } from 'styled-components';
import Link from 'Reusable/UndecoratedLink';

const common = css`
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

const StyledLink = styled(Link)`
  ${common};
`;

const StyledBtn = styled.div`
  ${common};
`;

StyledBtn.defaultProps = {};

const Btn = React.forwardRef(
  ({ children, link, className, ...mouseEvents }, ref) => {
    return link ? (
      <StyledLink
        className={className}
        innerRef={ref}
        onClick={mouseEvents.onClick}
        to={link}
      >
        {children}
      </StyledLink>
    ) : (
      <StyledBtn
        className={className}
        innerRef={ref}
        onClick={mouseEvents.onClick}
      >
        {children}
      </StyledBtn>
    );
  }
);

export default Btn;
