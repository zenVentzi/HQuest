import React from "react";
import { HandHoldingHeart as LikeIcon } from "styled-icons/fa-solid/HandHoldingHeart";
import IconBtn from "Reusable/IconBtn";
import StyledIcon from "Reusable/StyledIcon";

interface LikeBtnProps {
  isLiked: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const LikeBtn = (props: LikeBtnProps) => {
  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    /* how do we display the number of likes and personal likes?

    like in medium? */
    props.onClick(e);
  };
  return <IconBtn icon={LikeIcon} size="1.2em" onClick={onClick} />;
};

export default LikeBtn;
