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
