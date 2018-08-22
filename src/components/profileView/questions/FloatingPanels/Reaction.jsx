import React, { Fragment } from 'react';
import styled from 'styled-components';
import User from './SubUser';

const StyledReaction = styled.div`
  width: 80%;
  display: flex;
  min-height: min-content;
  justify-content: center;
  align-items: center;
  /* margin-bottom: 0.8em; */
`;

const Reaction = ({ reactionIcon: ReactionIcon }) => {
  const test = 5;

  return (
    <StyledReaction>
      <User size={1.5} />
      {ReactionIcon && <ReactionIcon size="2em" />}
    </StyledReaction>
  );
};

export default Reaction;
