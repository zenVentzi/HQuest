import React, { useState } from "react";
import { Mutation, MutationFn } from "react-apollo";
import TextBtn from "Reusable/TextBtn";
import gql from "graphql-tag";
import styled from "styled-components";

const FOLLOW = gql`
  mutation follow($userId: ID!, $follow: Boolean!) {
    follow(userId: $userId, follow: $follow)
  }
`;

const Btn = styled(TextBtn)`
  margin-bottom: 0.5em;
`;

interface FollowBtnProps {
  isFollowed: boolean;
  userId: string;
}

const FollowBtn = (props: FollowBtnProps) => {
  const [hovered, setHovered] = useState(false);
  const [isFollowed, setIsFollowed] = useState(props.isFollowed);

  const onMouseEnter = () => {
    setHovered(true);
  };

  const onMouseLeave = () => {
    setHovered(false);
  };

  const onClick = (mutation: MutationFn) => async () => {
    const { userId } = props;
    const follow = !isFollowed;
    await mutation({ variables: { userId, follow } });
    setIsFollowed(!isFollowed);
  };

  const normalText = isFollowed ? `Following` : `Follow`;
  const hoverText = isFollowed ? `Unfollow` : `Follow`;
  const text = hovered ? hoverText : normalText;

  return (
    <Mutation mutation={FOLLOW}>
      {follow => (
        <Btn
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={onClick(follow)}
        >
          {text}
        </Btn>
      )}
    </Mutation>
  );
};

export default FollowBtn;
