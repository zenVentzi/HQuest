import React, { Fragment } from 'react';
import User from './SubUser';
import styled from '../../../../node_modules/styled-components';

const Text = styled.p`
  width: 80%;
  font-family: 'Times New Roman', Times, serif;
  padding-left: 2.6em;
  font-size: 0.9em;
`;

const Comment = () => {
  const holder = 5;

  return (
    <Fragment>
      <User />
      <Text>
        This is some very very long comment This is some very very long comment
        This is some very very long comment This is some very very long comment
        This is some very very long comment This is some very very long comment
        This is some very very long comment
      </Text>
    </Fragment>
  );
};

export default Comment;
