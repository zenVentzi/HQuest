import React from 'react';
import styled from 'styled-components';

const StyledComments = styled.div`
  position: absolute;
  top: 20%;
  left: 20%;
  background: black;
  color: white;
`;

const Comments = () => {
  const holder = 5;
  return (
    <StyledComments>
      <ul>
        <li>comment1</li>
      </ul>
      <ul>
        <li>comment2</li>
      </ul>
    </StyledComments>
  );
};

export default Comments;
