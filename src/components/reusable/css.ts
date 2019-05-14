import { css } from "styled-components";
import { CSSProperties } from "react";

export type ClickableIconProps = {
  visible?: boolean | 0 | 1;
  backgroundColor: CSSProperties["backgroundColor"];
  color: CSSProperties["color"];
};

/* 
& * {
      color: ${props => (props.color === "white" ? "black" : "white")};
    }

    & * {
    color: ${props => props.color};
  }

 */

export const clickableIcon = css<ClickableIconProps>(props => {
  return `
  display: inline-block;
  background-color: ${props.backgroundColor};
  border-radius: 0.3em;
  cursor: pointer;
  visibility: ${
    props.visible || props.visible === undefined ? "inherit" : "hidden"
  };

  color: white;

  &:hover {
    background-color: ${props.color};
    color: ${props.backgroundColor};
  }`;
});

interface ClickableTextProps {
  disabled?: boolean;
}

export const clickableText = css<ClickableTextProps>`
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
