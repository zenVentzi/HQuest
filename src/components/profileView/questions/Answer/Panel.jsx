import React from 'react';
import styled from 'styled-components';

// this needs to be made more specific
const StyledPanel = styled.div`
  position: relative;
  width: 70%;
  max-height: 20em;
  padding: 0.5em;
  display: flex;
  flex: 1;
  overflow-y: auto;
  flex-direction: column;
  align-items: center;
  background: black;
  border-radius: 0.2em;
  color: white;

  @media (max-width: 600px) {
    width: 90%;
  }
`;

export default StyledPanel;
