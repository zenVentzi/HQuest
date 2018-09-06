import React, { Component } from 'react';
import styled from 'styled-components';

const Btn = styled.button`
  margin-bottom: 1em;
`;

const FollowingBtn = ({ following }) => {
  const onClick = () => {};

  return <Btn onClick={onClick()}>Following {following.length}</Btn>;
};

export default FollowingBtn;
