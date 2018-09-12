import styled from 'styled-components';

const StyledAnchor = styled.a`
  cursor: pointer;
  font-size: 0.7em;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
    text-shadow: 1px 1px 1px #555;
  }
`;

export default StyledAnchor;
