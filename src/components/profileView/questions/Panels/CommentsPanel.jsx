import React from 'react';
import styled from 'styled-components';
import { WindowClose } from 'styled-icons/fa-solid/WindowClose';

const StyledPanel = styled.div`
  width: 100%;
  height: 20em;
  padding: 0.5em;
  display: flex;
  flex: 1;
  overflow-y: auto;
  flex-direction: column;
  align-items: center;
  background: black;
  border-radius: 0.2em;
  color: white;
`;

// const CommentsPanel = ({ children }) => <StyledPanel>{children}</StyledPanel>;

// export default CommentsPanel;
export default StyledPanel;
