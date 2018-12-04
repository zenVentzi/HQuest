import React from 'react';
import styled from 'styled-components';

const StyledPanel = styled.div`
  position: relative;
  width: 100%;
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
`;

// class Panel extends React {
//   render() {
//     return ();
//   }
// }

export default StyledPanel;
