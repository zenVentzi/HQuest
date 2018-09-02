import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import styled, { ThemeProvider, withTheme } from 'styled-components';

const St = styled(Link)`
  color: black;
  background: ${props => props.theme.backgroundColor};
`;

const theme = { backgroundColor: 'red' };

const App = () => {
  return (
    <BrowserRouter>
      <St theme={theme} to="/">
        bla
      </St>
    </BrowserRouter>
  );
};

export default App;
