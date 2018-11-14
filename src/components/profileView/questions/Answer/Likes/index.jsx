import React from 'react';
import Panel from '../Panel';
import Liker from './Liker';

const Likes = ({ likes }) => {
  let likers;
  if (likes) {
    // eslint-disable-next-line prefer-destructuring
    likers = likes.likers;
  }

  return (
    <Panel>
      {likers && likers.length ? (
        likers.map(liker => <Liker key={liker.user.id} liker={liker} />)
      ) : (
        <div>Be the first one to like that answer</div>
      )}
    </Panel>
  );
};

export default Likes;
