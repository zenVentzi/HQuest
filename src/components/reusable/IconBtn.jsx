import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import StyledIcon from 'Reusable/StyledIcon';

const common = css`
  & * {
    background: black;
    color: white;
    border-radius: 0.3em;
    cursor: pointer;
  }

  &:hover * {
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

const Btn = React.forwardRef(({ icon, onClick, link }, ref) => {
  const content = <StyledIcon innerRef={ref} icon={icon} />;

  return link ? (
    <StyledLink onClick={onClick} to={link}>
      {content}
    </StyledLink>
  ) : (
    <StyledBtn onClick={onClick}>{content}</StyledBtn>
  );
});

export default Btn;
