const { ObjectID } = require('mongodb');

const addComment = async (comment, answerId, { collections, user }) => {
  const performer = await collections.users.findOne({
    _id: ObjectID(user.id),
  });

  const answerObj = await collections.answers.findOneAndUpdate(
    { _id: ObjectID(answerId) },
    {
      $push: { comments: { _id: ObjectID(), comment, userId: performer._id } },
    },
    { returnOriginal: false }
  );

  const { comments } = answerObj.value;
  const newDbComment = comments[comments.length - 1];
};

module.exports = { addComment };
