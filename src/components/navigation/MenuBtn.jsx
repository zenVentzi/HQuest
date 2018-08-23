import React from 'react';
import { Menu } from 'styled-icons/material/Menu';
import styled from 'styled-components';
import { WindowClose } from 'styled-icons/fa-solid/WindowClose';

const MenuBtn = props => {
  const holder = 5;

  return <Menu size="2em" css="cursor: pointer" {...props} />;
};

export default MenuBtn;
