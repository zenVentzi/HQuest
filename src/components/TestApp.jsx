import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Facebook as FacebookLogo } from 'styled-icons/fa-brands';

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

const App = () => <FacebookLogo size="1em" />;
export default App;
