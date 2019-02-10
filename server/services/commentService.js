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
        comments: { _id: ObjectId(), value: comment, user: performer._id },
      },
    },
    { new: true, fields: 'comments -_id' }
  )
    .populate('user')
    .lean();

  const addedComment = comments[comments.length - 1];
  return addedComment;
};

async function editComment({ answerId, commentId, commentValue, context }) {
  const {
    models: { User, Answer },
    user,
  } = context;

  const { comments: oldComments } = await Answer.findById(answerId)
    .populate('user')
    .lean();
  const newComments = [];
  let editedComment;

  oldComments.forEach(oldC => {
    const newComment = oldC;

    if (oldC._id.toString() === commentId) {
      newComment.value = commentValue;
      editedComment = newComment;
    }

    newComments.push(newComment);
  });

  await Answer.findByIdAndUpdate(answerId, { $set: { comments: newComments } });

  return editedComment;
}

async function removeComment({ answerId, commentId, context }) {
  const {
    models: { Answer, User },
  } = context;

  const { comments } = await Answer.findByIdAndUpdate(answerId, {
    $pull: {
      comments: { _id: ObjectId(commentId) },
    },
  })
    .populate('user')
    .lean();

  const removedComment = comments.find(com => com._id.toString() === commentId);
  return removedComment;
}

export default ToBeChanged => {
  return { addCommentToAnswer, editComment, removeComment };
};
