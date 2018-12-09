import styled from 'styled-components';

const StyledAnchor = styled.a`
  /* user-select: none; */
  cursor: pointer;
  text-align: center;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
    text-shadow: 1px 1px 1px #555;
  }
`;

export default StyledAnchor;
