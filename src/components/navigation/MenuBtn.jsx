import React from 'react';
import { Menu } from 'styled-icons/material/Menu';

const MenuBtn = props => {
  const holder = 5;

  return <Menu size="2em" css="cursor: pointer" {...props} />;
};

export default MenuBtn;
