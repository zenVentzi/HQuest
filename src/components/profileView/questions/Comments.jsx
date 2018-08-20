import React from 'react';
import styled from 'styled-components';
import Comment from './Comment';

const GrayBackground = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
`;

const StyledComments = styled.div`
  position: fixed;
  display: flex;
  flex: 1;
  overflow-y: scroll;
  flex-direction: column;
  align-items: center;
  top: 20%;
  left: 30%;
  width: 40%;
  height: 60%;
  background: black;
  border-radius: 0.2em;
  color: white;

  &::-webkit-scrollbar {
    width: 0.8em;
  }

  &::-webkit-scrollbar-track {
    background: ghostwhite;
    margin-right: 1em;
    /* change me to blue to match the background */
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 1em;
    background: black;
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); */
  }
`;

const Input = styled.textarea`
  margin-top: 2em;
  width: 80%;
  min-height: min-content;
  background: white;
  color: black;
  margin-bottom: 1em;
`;

const CloseBtn = styled.button`
  position: fixed;
  align-self: flex-end;
  margin-bottom: 1em;
`;

const Comments = () => {
  const holder = 5;
  return (
    <GrayBackground>
      <StyledComments>
        <CloseBtn>&#x2718;</CloseBtn>
        <Input placeholder="Add a comment..." />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
      </StyledComments>
    </GrayBackground>
  );
};

export default Comments;
