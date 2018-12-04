const { ObjectId } = require('mongoose').Types;
const { mapGqlComment } = require('../resolvers/helper');

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

  addedComment.user = performer;
  return mapGqlComment({
    comment: addedComment,
    loggedUserId: user.id,
  });
};

// TODO cleanup, it's not being used
const getAnswerComments = async (answerId, context) => {
  const {
    models: { Answer },
    user,
  } = context;

  const { comments } = await Answer.findById(answerId).lean();

  if (!comments) return [];

  const commentsPromises = comments.map(async com => {
    return mapGqlComment({
      comment: com,
      loggedUserId: user.id,
    });
  });

  return Promise.all(commentsPromises);
};

module.exports = { addCommentToAnswer, getAnswerComments };
