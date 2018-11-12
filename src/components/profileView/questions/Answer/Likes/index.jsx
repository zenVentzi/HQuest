import React from 'react';
import Panel from '../Panel';
import Liker from './Liker';

const Likes = ({ likes: { likers } }) => {
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
