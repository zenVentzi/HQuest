import { css } from 'styled-components';

export const iconBtn = css`
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
