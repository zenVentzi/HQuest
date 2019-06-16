/* 

do we implement "Got followed by" news?

*/

import React, { Fragment } from "react";
import styled from "styled-components";
import User from "Reusable/UserRow";
import { getTime } from ".";
import {
  NewFollowerNewsFieldsFragment,
  NewsBase
} from "GqlClient/autoGenTypes";

// this file is duplication of NewComment. To be fixed.
const NewFollowerWrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  color: black;
`;

const Text = styled.div`
  /* flex-grow: 1; */
  font-size: 16px;
`;

interface NewFollowerProps {
  news: NewFollowerNewsFieldsFragment & NewsBase;
}

const NewFollower = ({
  news: { performer, followedUser, createdOn }
}: NewFollowerProps) => {
  const topText = `Followed`;
  const bottomText = `${getTime(createdOn)}`;

  return (
    <NewFollowerWrapper>
      <div>
        <User user={performer} size={1.5} />
      </div>
      <Text>{topText}</Text>
      <div>
        <User user={followedUser} size={1.5} />
      </div>
      <Text>{bottomText}</Text>
    </NewFollowerWrapper>
  );
};

export default NewFollower;
