import React from 'react';
import AnsweredQuestion from './questions/AnsweredQuestion';

const CommentPin = ({ match: { params } }) => {
  console.log('TCL: CommentPin -> params', params);

  return <div>comment pin</div>;
  return <AnsweredQuestion />;
};

export default CommentPin;
