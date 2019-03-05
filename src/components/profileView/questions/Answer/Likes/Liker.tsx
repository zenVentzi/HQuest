import React from "react";
import styled from "styled-components";
import User from "Reusable/UserRow";
import { AnswerFieldsLikers } from "GqlClient/autoGenTypes";

const StyledLiker = styled.div`
  width: 80%;
  display: flex;
  min-height: min-content;
  justify-content: center;
  align-items: center;
  /* margin-bottom: 0.8em; */
`;

interface LikerProps {
  liker: AnswerFieldsLikers;
}

/* do I store the whole user info inside the liker object? */

const Liker = ({ liker }: LikerProps) => {
  return (
    <StyledLiker>
      <User size={1.5} user={liker.user} />
      <div>x{liker.numOfLikes}</div>
    </StyledLiker>
  );
};

export default Liker;
