import React from 'react';
import styled from 'styled-components';

const StyledReactions = styled.div`
  position: absolute;
  top: 20%;
  left: auto;
  width: 30%;
  height: 40%;
  background: black;
  color: white;
`;

const Reactions = () => {
  const holder = 5;
  return (
    <StyledReactions>
      <ul>
        <li>pesho</li>
      </ul>
      <ul>
        <li>gosho</li>
      </ul>
    </StyledReactions>
  );
};

export default Reactions;
