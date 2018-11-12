import { css } from 'styled-components';

export const clickableIcon = css`
  display: inline-block;
  background: black;
  border-radius: 0.3em;
  cursor: pointer;
  visibility: ${props => (props.visible ? 'inherit' : 'hidden')};

  color: ${props => (props.reverseColor ? 'black' : 'white')};

  &:hover {
    background: ${props => (props.reverseColor ? 'black' : 'white')};

    & * {
      color: ${props => (props.reverseColor ? 'white' : 'black')};
    }
  }
`;
export const clickableText = css`
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
