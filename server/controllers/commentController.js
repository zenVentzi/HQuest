const { ObjectId } = require('mongoose').Types;

const addCommentToAnswer = async ({ comment, answerId }, context) => {
  const {
    models: { User, Answer },
    user,
  } = context;
  const performerId = user.id;

  const performer = await User.findById(performerId).lean();
  const { comments } = await Answer.findByIdAndUpdate(
    answerId,
    {
      $push: {
        comments: { _id: ObjectId(), value: comment, userId: performer._id },
      },
    },
    { new: true, fields: 'comments -_id' }
  ).lean();

  const addedComment = comments[comments.length - 1];
  addedComment.user = await User.findById(user.id);
  return addedComment;
};

async function edit({ answerId, commentId, commentValue, context }) {
  const {
    models: { User, Answer },
    user,
  } = context;
  const performerId = user.id;

  const performer = await User.findById(performerId).lean();
  // this is just a tempalte,won't work, fix it
  const { comments } = await Answer.findByIdAndUpdate(
    answerId,
    {
      $push: {
        comments: {
          _id: ObjectId(),
          value: commentValue,
          userId: performer._id,
        },
      },
    },
    { new: true, fields: 'comments -_id' }
  ).lean();

  const addedComment = comments[comments.length - 1];
  addedComment.user = await User.findById(user.id);
  return addedComment;
}

async function remove({ answerId, commentId, context }) {
  const {
    models: { Answer, User },
    user,
  } = context;

  const { comments } = await Answer.findByIdAndUpdate(answerId, {
    $pull: {
      comments: { _id: ObjectId(commentId) },
    },
  }).lean();

  const removedComment = comments.find(com => com._id.toString() === commentId);
  removedComment.user = await User.findById(user.id);
  return removedComment;
}

module.exports = { addCommentToAnswer, edit, remove };
