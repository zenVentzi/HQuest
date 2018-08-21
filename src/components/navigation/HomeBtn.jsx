import React from 'react';
import { Home } from 'styled-icons/material/Home';

const HomeBtn = props => {
  const holder = 5;

  return <Home size="2em" css="cursor: pointer;" {...props} />;
};

export default HomeBtn;
