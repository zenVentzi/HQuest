import React, { Component } from 'react';
import styled from 'styled-components';

const Btn = styled.button`
  margin-bottom: 1em;
`;

const FollowersBtn = ({ followers }) => {
  const onClick = () => {};
  return <Btn onClick={onClick()}>Followers {followers.length}</Btn>;
};

export default FollowersBtn;
