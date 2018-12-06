/* 

do we implement "Got followed by" news?

*/

import React, { Fragment } from 'react';
import distanceInWords from 'date-fns/distance_in_words';
import styled from 'styled-components';
import User from 'Reusable/UserRow';
import { getLoggedUserId } from 'Utils';

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

const getTime = createdOn => {
  const startDate = new Date(createdOn).getTime();
  const dateTimeNow = new Date().getTime();

  const res = distanceInWords(startDate, dateTimeNow, {
    includeSeconds: true,
  });

  return `${res} ago`;
};

const NewFollower = ({ news: { performer, followedUser, createdOn } }) => {
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
