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

const StyledReactions = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 20%;
  left: 30%;
  width: 40%;
  height: 60%;
  background: black;
  border-radius: 0.2em;
  color: white;
`;

const Input = styled.textarea`
  width: 80%;
  /* box-sizing: border-box; */
  background: white;
  color: black;
  margin-bottom: 1em;
`;

const CloseBtn = styled.button`
  align-self: flex-end;
  margin-bottom: 1em;
`;

const Reactions = () => {
  const holder = 5;
  return (
    <GrayBackground>
      <StyledReactions>
        <CloseBtn>&#x2718;</CloseBtn>
        <Input placeholder="Add a comment..." />
        <Comment />
      </StyledReactions>
    </GrayBackground>
  );
};

export default Reactions;
