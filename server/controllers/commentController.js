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
  return mapGqlComment(context, performer, addedComment);
};

const getAnswerComments = async (answerId, context) => {
  const {
    models: { Answer, User },
  } = context;

  const { comments } = await Answer.findById(answerId).lean();

  if (!comments) return [];
  // TODO: This can be optimized with Dataloader
  const commentsPromises = comments.map(async com => {
    const commentAuthor = await User.findById(com.userId).lean();
    return mapGqlComment(context, commentAuthor, com);
  });

  return Promise.all(commentsPromises);
};

module.exports = { addCommentToAnswer, getAnswerComments };
