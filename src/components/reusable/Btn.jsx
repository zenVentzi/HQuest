import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledBtn = styled.button``;

StyledBtn.defaultProps = {};

const Btn = ({ children, onClick, link }) => {
  if (React.Children.count(children) !== 1) {
    throw new Error(`Btn should have exactly 1 child`);
  }
  const a = 5;
  return link ? (
    <Link to={link}>{children}</Link>
  ) : (
    <StyledBtn onClick={onClick}>{children}</StyledBtn>
  );
};

export default Btn;
