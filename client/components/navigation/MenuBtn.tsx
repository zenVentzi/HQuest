import React from "react";
import { Menu } from "styled-icons/material/Menu";
import { StyledIconProps } from "styled-icons/types";

const MenuBtn = (props: StyledIconProps) => {
  return <Menu size="2em" css="cursor: pointer" {...props} />;
};

export default MenuBtn;
