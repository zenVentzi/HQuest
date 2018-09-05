const { ObjectId } = require('mongoose').Types;
const { mapGqlComment } = require('../resolvers/helper');

const add = async ({ comment, answerId }, { context }) => {
  const {
    models: { User, Answer },
    user,
  } = context;
  const performerId = user.id;

  const performer = await User.findById(performerId);
  const comments = await Answer.findOneAndUpdate(
    { _id: ObjectId(answerId) },
    {
      $push: { comments: { _id: ObjectId(), comment, userId: performer._id } },
    },
    { returnOriginal: false, fields: 'comments' }
  );

  // const { comments } = answer;
  const commentObj = comments[comments.length - 1];
  const res = mapGqlComment(context, performer, commentObj);
  return res;
};

const getMany = async (answerId, context) => {
  const {
    models: { Answer, User },
  } = context;

  const answer = await Answer.findById(answerId);

  const { comments } = answer;

  if (!comments) return [];
  // TODO: This can be optimized with Dataloader
  const commentsPromises = comments.map(async com => {
    const commentAuthor = await User.findById(com.userId);
    return mapGqlComment(context, commentAuthor, com);
  });

  return Promise.all(commentsPromises);
};

module.exports = { add, getMany };
