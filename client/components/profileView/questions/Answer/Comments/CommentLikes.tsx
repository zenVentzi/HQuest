import React from "react";
import Liker from "../Likes/Liker";
import { CommentFieldsFragment } from "GqlClient/autoGenTypes";
import Modal from "Reusable/Modal";

import styled from "styled-components";
import Panel from "Reusable/WhitePanel";

const BackgroundShadow = styled.div`
  position: fixed;
  z-index: 1;
  width: 100%;
  height: 100%;
`;

// this needs to be made more specific
const StyledPanel = styled.div`
  position: fixed;
  z-index: 2;
  top: 10%;
  left: 25%;
  width: 50%;
  height: 80%;
  max-height: 80%;
  padding: 0.5em;
  display: flex;
  flex: 1;
  overflow-y: auto;
  flex-direction: column;
  align-items: center;
  background: white;
  color: black;
  border-radius: 0.2em;

  /* @media (max-width: 600px) {
    width: 90%;
  } */

  /* TODO make responsive */
`;

type LikesProps = {
  onClose: () => void;
} & Pick<CommentFieldsFragment, "likes">;

const CommentLikes = ({ likes, onClose }: LikesProps) => {
  if (!likes) {
    return (
      <Panel onClose={onClose}>
        <div style={{ color: "black" }}>
          Be the first one to like that answer
        </div>
      </Panel>
    );
  }

  const { likers } = likes;

  return (
    <Panel onClose={onClose}>
      {likers.map(liker => (
        <Liker key={liker.user.id} liker={liker} />
      ))}
    </Panel>
  );
};

export default CommentLikes;
