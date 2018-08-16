import React, { Fragment } from 'react';
import styled from 'styled-components';
import avatar from './avatar.png';

const Wrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  z-index: 100;
  border: 4px solid red;
`;

const Img = styled.img`
  max-width: 100%;
  max-height: 100%;
  border-radius: 50%;
`;

const App = () => (
  <Wrapper>
    <Img
      src="https://upload.wikimedia.org/wikipedia/commons/6/68/Solid_black.png"
      alt="bla"
    />
  </Wrapper>
);

export default App;
