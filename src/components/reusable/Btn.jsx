import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

/* stylelint-disable */
const StyledBtn = styled.button``;
/* stylelint-enable */

StyledBtn.defaultProps = {};

const Btn = ({ children, onClick, link }) => {
  if (React.Children.count(children) !== 1) {
    throw new Error(`Btn should have exactly 1 child`);
  }

  return link ? (
    <Link to={link}>{children}</Link>
  ) : (
    <StyledBtn onClick={onClick}>{children}</StyledBtn>
  );
};

export default Btn;
