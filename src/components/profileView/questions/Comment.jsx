import React, { Fragment } from 'react';
import User from './SubUser';
import styled from '../../../../node_modules/styled-components';

const Text = styled.p`
  /* width: 80%; */
  font-family: 'Times New Roman', Times, serif;
  padding-left: 2.6em;
  font-size: 0.9em;
`;

const StyledComment = styled.div`
  width: 80%;
  margin-bottom: 0.8em;
`;

const Comment = () => {
  const holder = 5;

  return (
    <StyledComment>
      <User />
      <Text>
        This is some very very long comment This is some very very long comment
        This is some very very long comment This is some very very long comment
        This is some very very long comment This is some very very long comment
        This is some very very long comment
      </Text>
    </StyledComment>
  );
};

export default Comment;
