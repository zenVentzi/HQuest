import React from 'react';
import styled from 'styled-components';
import User from 'Reusable/UserRow';

const StyledLiker = styled.div`
  width: 80%;
  display: flex;
  min-height: min-content;
  justify-content: center;
  align-items: center;
  /* margin-bottom: 0.8em; */
`;

/* do I store the whole user info inside the liker object? */

const Liker = ({ liker }) => {
  return (
    <StyledLiker>
      <User size={1.5} user={liker.user} />
      {/* {ReactionIcon && <ReactionIcon size="2em" />} */}
    </StyledLiker>
  );
};

export default Liker;
