import React from "react";
import styled from "styled-components";
import TextBtn from "Reusable/TextBtn";

const Btn = styled(TextBtn)`
  margin-bottom: 1em;
`;

interface FollowersBtnProps {
  followers: any[];
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const FollowersBtn = ({ followers, onClick }: FollowersBtnProps) => {
  return <Btn onClick={onClick}>Followers {followers.length}</Btn>;
};

export default FollowersBtn;
