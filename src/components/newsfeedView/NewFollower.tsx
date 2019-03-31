/* 

do we implement "Got followed by" news?

*/

import React, { Fragment } from "react";
import styled from "styled-components";
import User from "Reusable/UserRow";
import { getTime } from ".";
import { NewFollowerNews } from "GqlClient/autoGenTypes";

// this file is duplication of NewComment. To be fixed.
const NewFollowerWrapper = styled.div`
  width: 100%;
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 2px solid white;
`;

const Text = styled.div`
  /* flex-grow: 1; */
  font-size: 0.8em;
`;

interface NewFollowerProps {
  news: NewFollowerNews;
}

const NewFollower = ({
  //@ts-ignore
  news: { performer, followedUser, createdOn }
}: NewFollowerProps) => {
  const topText = `Followed, ${getTime(createdOn)},`;

  return (
    <NewFollowerWrapper>
      <User user={performer} size={1.5} />
      <Text>{topText}</Text>
      <User user={followedUser} size={1.5} />
    </NewFollowerWrapper>
  );
};

export default NewFollower;
