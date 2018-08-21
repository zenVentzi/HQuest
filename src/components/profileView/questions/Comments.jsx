import React from 'react';
import styled from 'styled-components';
import Comment from './Comment';
import FixedPanel from './FixedPanel';

const Input = styled.textarea`
  margin-top: 2em;
  width: 80%;
  min-height: min-content;
  background: white;
  color: black;
  margin-bottom: 1em;
`;

const Comments = () => {
  const holder = 5;
  return (
    <FixedPanel>
      <Input placeholder="Add a comment..." />
      <Comment />
      <Comment />
      <Comment />
      <Comment />
      <Comment />
      <Comment />
      <Comment />
    </FixedPanel>
  );
};

export default Comments;
