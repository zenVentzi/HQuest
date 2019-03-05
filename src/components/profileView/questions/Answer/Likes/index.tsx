import React from "react";
import Panel from "../Panel";
import Liker from "./Liker";
import { AnswerFieldsLikes } from "GqlClient/autoGenTypes";

interface LikesProps {
  likes: AnswerFieldsLikes | null;
  onClose: () => void;
}

const Likes = ({ likes }: LikesProps) => {
  if (!likes) {
    return (
      <Panel>
        <div>Be the first one to like that answer</div>
      </Panel>
    );
  }
  const { likers } = likes;

  return (
    <Panel>
      {likers.map(liker => (
        <Liker key={liker.user.id} liker={liker} />
      ))}
    </Panel>
  );
};

export default Likes;
