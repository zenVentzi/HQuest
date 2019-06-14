import React from "react";
import styled from "styled-components";
import TextBtn from "Reusable/TextBtn";

const Btn = styled(TextBtn)`
  margin-bottom: 1em;
  margin-right: 1em;
`;

interface FollowingBtnProps {
  numOfFollowing: number;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const FollowingBtn = ({ numOfFollowing, onClick }: FollowingBtnProps) => {
  return (
    <Btn onClick={onClick} color="white" backgroundColor="black">
      Following {numOfFollowing}
    </Btn>
  );
};

export default FollowingBtn;
