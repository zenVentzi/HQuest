import React from "react";
import styled from "styled-components";
import TextBtn from "Reusable/TextBtn";

const Btn = styled(TextBtn)`
  margin-bottom: 1em;
`;

interface FollowersBtnProps {
  numOfFollowers: number;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const FollowersBtn = ({ numOfFollowers, onClick }: FollowersBtnProps) => {
  return (
    <Btn onClick={onClick} color="white" backgroundColor="black">
      Followers {numOfFollowers}
    </Btn>
  );
};

export default FollowersBtn;
