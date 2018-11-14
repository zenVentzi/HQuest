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

const editUser = async (_, { input }, context) => {
  return userController.editUser(input, context);
};

async function addComment(_, { answerId, comment }, context) {
  const commentObj = await commentController.addCommentToAnswer(
    { answerId, comment },
    context
  );
  await notificationController.newComment(answerId, commentObj, context);
  return commentObj;
}

async function createQuestion(_, args, context) {
  return questionController.createQuestion(args, context);
}

async function questionNotApply(_, args, context) {
  return questionController.markNotApply(args, context);
}

async function editAnswer(_, args, context) {
  return answerController.edit(args, context);
}

async function addAnswer(_, args, context) {
  const answer = await answerController.add(args, context);

  const answeredQuestion = await questionController.getAnsweredQuestion(
    context.user.id,
    args.questionId,
    context
  );

  const performer = await userController.getUser(context.user.id, context);

  await newsfeedController.onNewAnswer({
    answeredQuestion,
    performer,
    context,
  });

  return answer;
}

async function removeAnswer(_, args, context) {
  return answerController.remove(args, context);
}
async function likeAnswer(_, args, context) {
  return answerController.like(args, context);
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
  addComment,
  editUser,
  login,
  createQuestion,
  questionNotApply,
  addAnswer,
  editAnswer,
  removeAnswer,
  likeAnswer,
  moveAnswerPosition,
  uploadAvatar,
  follow,
};
