import { css } from 'styled-components';

export const clickableIcon = css`
  display: inline-block;
  background: black;
  border-radius: 0.3em;
  cursor: pointer;
  visibility: ${props => (props.hide ? 'hidden' : 'visible')};

  & * {
    color: white;
  }

  &:hover {
    background: white;

    & * {
      color: black;
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
