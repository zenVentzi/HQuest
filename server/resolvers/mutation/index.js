const bcrypt = require('bcrypt');
const { ObjectId } = require('mongoose').Types;
const fs = require('fs');
const jsonwebtoken = require('jsonwebtoken');
const { createError } = require('apollo-errors');

const {
  userController,
  questionController,
  answerController,
  notificationController,
  commentController,
} = require('../../controllers');
const { isAuthenticatedResolver } = require('../accessResolvers');

const addBook = isAuthenticatedResolver.createResolver(
  async (root, args, context) => {
    const {
      models: { Book },
    } = context;
    const book = {
      title: args.title,
      author: args.author,
      created: new Date(),
    };

    const newBook = new Book(book);

    await newBook.save();

    // await collections.books.insertOne(book);

    // const payload = {
    //   bookAdded: book,
    // };

    // pubsub.publish('bookAdded', payload);

    return book;
  }
);

async function signUp(_, args, context) {
  const user = await userController.signUp(args, context);

  return jsonwebtoken.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '1y',
    }
  );
}

async function login(_, args, context) {
  const user = await userController.login(args, context);
  const authToken = jsonwebtoken.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );
  const result = {
    authToken,
    userId: user.id,
  };

  return result;
}

async function addComment(_, args, context) {
  // if (!context.user) {
  //   throw new Error('You are not authorized!');
  // }

  // const performer = await controllers.user.find(loggedUser.id);
  const newComment = await commentController.addCommentToAnswer(args, context);
  return newComment;

  // const { collections } = context;
  // #region old code
  // const performer = await collections.users.findOne({
  //   _id: ObjectID(context.user.id),
  // });

  // const answerObj = await collections.answers.findOneAndUpdate(
  //   { _id: ObjectID(answerId) },
  //   {
  //     $push: { comments: { _id: ObjectID(), comment, userId: performer._id } },
  //   },
  //   { returnOriginal: false }
  // );

  // const { comments } = answerObj.value;
  // const newDbComment = comments[comments.length - 1];

  // const res = gqlComment(context, performer, newDbComment);
  // const performerId = performer._id.toString();
  // const questionId = answerObj.value.questionId.toString();
  // const commentId = newDbComment._id.toString();

  // const performerName = `${performer.firstName} ${performer.surName}`;
  // const notif = {
  //   _id: ObjectID(),
  //   type: 'NEW_COMMENT',
  //   questionId,
  //   commentId,
  //   performerId,
  //   performerAvatarSrc: performer.avatarSrc,
  //   text: `${performerName} commented: "${comment} "`,
  //   seen: false,
  // };

  // const receiverId = answerObj.value.userId;

  // await collections.users.updateOne(
  //   { _id: ObjectID(receiverId) },
  //   { $push: { notifications: notif } },
  //   { upsert: true }
  // );

  // const payload = { receiverId, notif: gqlNotfication(notif) };
  // pubsub.publish('newNotification', payload);

  // return res;
  // #endregion
}

async function createQuestion(_, args, context) {
  return questionController.createQuestion(args, context);
}

async function editAnswer(_, args, context) {
  return answerController.edit(args, context);
}

async function addAnswer(_, args, context) {
  return answerController.add(args, context);
}

async function removeAnswer(_, args, context) {
  return answerController.remove(args, context);
}

async function saveAvatarToFile(base64Img, userId) {
  const src = `/public/images/avatar${userId}.jpeg`;

  return new Promise(resolve => {
    fs.writeFile(`${process.cwd()}${src}`, base64Img, 'base64', err => {
      resolve(src);
    });
  });
}

async function uploadAvatar(_, { base64Img }, context) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const { collections } = context;

  const avatarSrc = await saveAvatarToFile(base64Img, context.user.id);
  await collections.users.updateOne(
    { _id: ObjectId(context.user.id) },
    { $set: { avatarSrc } }
  );
  return avatarSrc;
}

async function follow(_, { userId, follow: shouldFollow }, context) {
  if (shouldFollow) {
    await userController.follow(userId, context);
    // await notificationController.newFollower(userId, context);
  } else {
    await userController.unfollow(userId, context);
  }
}

async function notifsMarkSeen(_, __, context) {
  await notificationController.markSeen(context);
}

module.exports = {
  addBook,
  notifsMarkSeen,
  addComment,
  signUp,
  login,
  createQuestion,
  addAnswer,
  editAnswer,
  removeAnswer,
  uploadAvatar,
  follow,
};
