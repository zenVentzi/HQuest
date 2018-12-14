const { ObjectId } = require('mongoose').Types;
// const { mapGqlComment } = require('../resolvers/helper');

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
      $push: { comments: { _id: ObjectId(), comment, userId: performer._id } },
    },
    { new: true, fields: 'comments -_id' }
  ).lean();

  const addedComment = comments[comments.length - 1];
  return addedComment;
};

async function editComment({ answerId, commentId, commentValue, context }) {
  const {
    models: { User, Answer },
    user,
  } = context;
  const performerId = user.id;

  const performer = await User.findById(performerId).lean();
  const { comments } = await Answer.findByIdAndUpdate(
    answerId,
    {
      $push: { comments: { _id: ObjectId(), comment, userId: performer._id } },
    },
    { new: true, fields: 'comments -_id' }
  ).lean();

  const addedComment = comments[comments.length - 1];
  return addedComment;
}

async function removeComment({ answerId, commentId, context }) {}

module.exports = { addCommentToAnswer };
