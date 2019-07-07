import { css } from "styled-components";
import { CSSProperties } from "react";

export type ClickableIconProps = {
  visible?: boolean | 0 | 1;
  backgroundColor: CSSProperties["backgroundColor"];
  color: CSSProperties["color"];
};

/* 

i have to either use .attrs to remove bgColor and color
or not pass them at all from the styles prop but rather
simple props like before

2) use less generalized component. I.e. make every component that needs it
implement it themselves, which still requires the usage of .attrs

using .attrs to remove the style from component has the most magic
but as long as I add a comment with the reason why I am doing it
it should be alright

3) create black/white button component

*/

export const clickableIcon = css<ClickableIconProps>(props => {
  return css`
    display: inline-block;
    background-color: ${props.backgroundColor};
    color: ${props.color};
    border-radius: 5px;
    cursor: pointer;
    visibility: ${props.visible || props.visible === undefined
      ? "inherit"
      : "hidden"};

    &:hover {
      background: ${props.color};
      color: ${props.backgroundColor};
    }
    &:active {
      background: ${props.backgroundColor};
      color: ${props.color};
      /* border-radius: 0.3em; */
    }
  `;
});

export type ClickableTextProps = {
  disabled?: boolean;
  backgroundColor: CSSProperties["backgroundColor"];
  color: CSSProperties["color"];
};

export const clickableText = css<ClickableTextProps>`
  ${props => {
    return css`
      display: inline-block;
      background: ${props.backgroundColor};
      color: ${props.color};
      border: 2px solid ${props.color};
      border-radius: 0.3em;
      padding: 0.3em 0.8em;
      cursor: pointer;

      &:hover {
        background: ${props.color};
        color: ${props.backgroundColor};
        border: 2px solid ${props.backgroundColor};
      }
      &:active {
        border: 2px solid ${props.color};
        background: ${props.backgroundColor};
        color: ${props.color};
      }
    `;
  }}
`;
