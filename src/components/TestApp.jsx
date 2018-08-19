import React, { Fragment } from 'react';
import styled from 'styled-components';

const Parent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100px;
  background: blue;
`;

const Child = styled.div`
  /* flex: 0.1; */
  flex-grow: 0.2;
  background: red;
  align-self: center;
  border: 1px solid black;
`;

const App = () => (
  <Parent>
    <Child>fddddddddddddddddddddddddddddd</Child>
    <Child />
  </Parent>
);
export default App;
