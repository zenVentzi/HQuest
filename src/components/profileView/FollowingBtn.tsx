import React, { Component } from "react";
import styled from "styled-components";
import TextBtn from "Reusable/TextBtn";

const Btn = styled(TextBtn)`
  margin-bottom: 1em;
  margin-right: 1em;
`;

interface FollowingBtnProps {
  following: any[];
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const FollowingBtn = ({ following, onClick }: FollowingBtnProps) => {
  return <Btn onClick={onClick}>Following {following.length}</Btn>;
};

export default FollowingBtn;
