import React from 'react';
import styled, { css } from 'styled-components';
import Link from 'Reusable/UndecoratedLink';

const common = css`
  background: black;
  color: white;
  border: 2px solid white;
  border-radius: 0.3em;
  padding: 0.3em 0.8em;

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

const Btn = ({ children, onClick, link }) => {
  return link ? (
    <StyledLink onClick={onClick} to={link}>
      {children}
    </StyledLink>
  ) : (
    <StyledBtn onClick={onClick}>{children}</StyledBtn>
  );
};

export default Btn;
