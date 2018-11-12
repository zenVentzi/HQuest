import React from 'react';
import styled from 'styled-components';
import User from 'Reusable/UserRow';

const StyledLike = styled.div`
  width: 80%;
  display: flex;
  min-height: min-content;
  justify-content: center;
  align-items: center;
  /* margin-bottom: 0.8em; */
`;

const Like = ({ like }) => {
  return (
    <StyledLike>
      <User size={1.5} user={like.user} />
      {/* {ReactionIcon && <ReactionIcon size="2em" />} */}
    </StyledLike>
  );
};

export default Like;
