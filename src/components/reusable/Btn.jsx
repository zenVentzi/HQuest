import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LinkBtn = styled(Link)``;

const StyledBtn = styled.button``;

StyledBtn.defaultProps = {};

const Btn = ({ children, onClick, link }) => {
  if (React.Children.count(children) !== 1) {
    throw new Error(`Btn should have exactly 1 child`);
  }

  return link ? (
    <LinkBtn to={link}>{children}</LinkBtn>
  ) : (
    <StyledBtn onClick={onClick}>{children}</StyledBtn>
  );
};

export default Btn;
