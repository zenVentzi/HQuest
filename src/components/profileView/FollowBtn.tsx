import React, { useState } from "react";
import { Mutation, MutationFn } from "react-apollo";
import TextBtn from "Reusable/TextBtn";
import styled from "styled-components";
import { FOLLOW } from "GqlClient/user/mutations";
import {
  FollowMutation,
  FollowMutationVariables
} from "GqlClient/autoGenTypes";

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

  const onClick = (
    mutation: MutationFn<FollowMutation, FollowMutationVariables>
  ) => async () => {
    const { userId } = props;
    const follow = !isFollowed;
    await mutation({ variables: { userId, follow } });
    setIsFollowed(!isFollowed);
  };

  const normalText = isFollowed ? `Following` : `Follow`;
  const hoverText = isFollowed ? `Unfollow` : `Follow`;
  const text = hovered ? hoverText : normalText;

  return (
    <Mutation<FollowMutation, FollowMutationVariables> mutation={FOLLOW}>
      {follow => (
        <Btn
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onClick(follow)}
        >
          {text}
        </Btn>
      )}
    </Mutation>
  );
};

export default FollowBtn;
