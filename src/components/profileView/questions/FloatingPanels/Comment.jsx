import React, { Fragment } from 'react';
import styled from 'styled-components';
import { CaretSquareDown } from 'styled-icons/fa-regular/CaretSquareDown';
import User from './SubUser';

const OptionsBtn = styled(CaretSquareDown).attrs({ size: '0.8em' })`
  cursor: pointer;
  margin-left: auto;
  align-self: center;
`;

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

const Header = styled.div`
  display: flex;
  width: 100%;
`;

const Comment = ({ comment: { user, comment } }) => (
  <StyledComment>
    <Header>
      <User user={user} />
      <OptionsBtn />
    </Header>
    <Text>{comment}</Text>
    {/* <Text>
        This is some very very long comment This is some very very long comment
        This is some very very long comment This is some very very long comment
        This is some very very long comment This is some very very long comment
        This is some very very long comment
      </Text> */}
  </StyledComment>
);

export default Comment;
