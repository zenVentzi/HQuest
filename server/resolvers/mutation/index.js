const jsonwebtoken = require('jsonwebtoken');
const { createError } = require('apollo-errors');

const {
  userController,
  questionController,
  answerController,
  notificationController,
  newsfeedController,
  commentController,
} = require('../../controllers');
const { isAuthenticatedResolver } = require('../accessResolvers');
const { mapGqlAnswer, mapGqlComment } = require('../../resolvers/helper');

// *book is for testing purposes
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

async function editUser(_, { input }, context) {
  return userController.editUser(input, context);
}

async function commentAnswer(_, { answerId, comment }, context) {
  const dbComment = await commentController.addCommentToAnswer(
    { answerId, comment },
    context
  );

  await newsfeedController.onNewComment({
    answerId,
    commentId: dbComment._id.toString(),
    context,
  });
  await notificationController.newComment(answerId, dbComment, context);

  return mapGqlComment({
    dbComment,
    loggedUserId: context.user.id,
  });
}

async function editComment(_, args, context) {
  const dbComment = await commentController.editComment({ ...args, context });

  return mapGqlComment({
    dbComment,
    loggedUserId: context.user.id,
  });
}

async function removeComment(_, args, context) {
  const dbComment = await commentController.removeComment({
    ...args,
    context,
  });

  return mapGqlComment({
    dbComment,
    loggedUserId: context.user.id,
  });
}

async function addQuestions(_, { questions }, context) {
  return questionController.addQuestions({ questions, context });
}

async function questionNotApply(_, args, context) {
  return questionController.markNotApply(args, context);
}

async function editAnswer(_, args, context) {
  const answer = await answerController.edit(args, context);

  await newsfeedController.onEditAnswer({
    answer,
    context,
  });

  return mapGqlAnswer({ answer, loggedUserId: context.user.id });
}

async function addAnswer(_, args, context) {
  const answer = await answerController.add(args, context);

  await newsfeedController.onNewAnswer({
    answer,
    context,
  });

  return mapGqlAnswer({ answer, loggedUserId: context.user.id });
}

async function removeAnswer(_, args, context) {
  const removedAnswer = await answerController.remove(args, context);

  return mapGqlAnswer({ answer: removedAnswer, loggedUserId: context.user.id });
}
async function likeAnswer(_, args, context) {
  const likedAnswer = await answerController.like(args, context);
  await newsfeedController.onLikeAnswer({
    answerId: likedAnswer._id.toString(),
    context,
  });
  return mapGqlAnswer({ answer: likedAnswer, loggedUserId: context.user.id });
}
async function moveAnswerPosition(_, args, context) {
  return answerController.movePosition(args, context);
}

async function uploadAvatar(_, { base64Img }, context) {
  const avatarSrc = await userController.uploadAvatar(base64Img, context);
  return avatarSrc;
}

async function follow(_, { userId, follow: shouldFollow }, context) {
  if (shouldFollow) {
    await userController.follow(userId, context);
    await newsfeedController.onFollowUser({ followedUserId: userId, context });
    await notificationController.newFollower(userId, context);
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
  commentAnswer,
  editComment,
  removeComment,
  editUser,
  login,
  addQuestions,
  questionNotApply,
  addAnswer,
  editAnswer,
  removeAnswer,
  likeAnswer,
  moveAnswerPosition,
  uploadAvatar,
  follow,
};
