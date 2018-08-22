const bcrypt = require('bcrypt');
const { ObjectID } = require('mongodb');
const fs = require('fs');
const jsonwebtoken = require('jsonwebtoken');
const { createWriteStream } = require('fs');

const defaultValues = require(`../../db/defaultValues`);
const { gqlComment } = require('../helper');
const { pubsub } = require('../../PubSub');

async function seedDb(
  root,
  __,
  { collections: { questions, answers, users } }
) {
  // await questions.drop();
  // await answers.drop();
  // await users.drop();

  await questions.insertMany(defaultValues.questions);
  // answers will be added directly from the interface
  await users.insertMany(defaultValues.users);

  // const res = await collections.users.find().toArray();
  // console.log(res);
}

async function addBook(root, args, context) {
  const { collections } = context;
  const book = { title: args.title, author: args.author };

  await collections.books.insertOne(book);

  const payload = {
    bookAdded: book,
  };

  pubsub.publish('bookAdded', payload);

  return book;
}

async function signUp(_, { firstName, surName, email, password }, context) {
  const user = {
    firstName,
    surName,
    email,
    password: await bcrypt.hash(password, 10),
  };

  await context.collections.users.insertOne(user);

  return jsonwebtoken.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '1y',
    }
  );
}

async function login(_, { email, password }, context) {
  const dbUser = await context.collections.users.findOne({
    email,
  });

  if (!dbUser) {
    throw new Error('No user with that email');
  }
  const passwordHash = dbUser.password;
  const valid = await bcrypt.compare(password, passwordHash);

  if (!valid) {
    throw new Error('Incorrect password');
  }

  return jsonwebtoken.sign(
    { id: dbUser._id, email: dbUser.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );
}

async function addComment(_, { answerId, comment }, context) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const { collections } = context;
  const dbUser = await collections.users.findOne({
    _id: ObjectID(context.user.id),
  });

  const answerObj = await collections.answers.findOneAndUpdate(
    { _id: ObjectID(answerId) },
    { $push: { comments: { _id: ObjectID(), comment, userId: dbUser._id } } },
    { returnOriginal: false }
  );

  const { comments } = answerObj.value;
  const newDbComment = comments[comments.length - 1];

  const res = gqlComment(context, dbUser, newDbComment);

  return res;
}

async function createQuestion(_, { question, type, possibleAnswers }, context) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const { collections } = context;

  await collections.questions.insertOne({
    question,
    type,
    possibleAnswers,
  });
}

async function editAnswer(_, { answerId, answerValue }, context) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const { collections } = context;

  let modifiedObj = await collections.answers.findOneAndUpdate(
    { _id: ObjectID(answerId) },
    { $set: { value: answerValue } },
    { returnOriginal: false }
  );

  modifiedObj = modifiedObj.value;

  return {
    id: modifiedObj._id.toString(),
    questionId: modifiedObj.questionId.toString(),
    userId: modifiedObj.userId.toString(),
    value: modifiedObj.value,
  };
}

async function addAnswer(_, { questionId, answerValue }, context) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const { collections } = context;

  const objToInsert = {
    userId: ObjectID(context.user.id),
    questionId: ObjectID(questionId),
    value: answerValue,
  };

  await collections.answers.insertOne(objToInsert);

  const result = { ...objToInsert };
  result.id = objToInsert._id.toString();
  delete result._id;

  return result;
}

async function removeAnswer(_, { answerId }, context) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const { collections } = context;

  let removedObj = await collections.answers.findOneAndDelete({
    _id: ObjectID(answerId),
  });

  removedObj = removedObj.value;

  return {
    id: removedObj._id.toString(),
    questionId: removedObj.questionId.toString(),
    userId: removedObj.userId.toString(),
    value: removedObj.value,
  };
}

async function saveAvatarToFile(base64Img, userId) {
  const src = `/public/images/avatar${userId}.jpeg`;

  return new Promise((resolve, reject) => {
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
    { _id: ObjectID(context.user.id) },
    { $set: { avatarSrc } }
  );
  return avatarSrc;
}

module.exports = {
  addBook,
  addComment,
  signUp,
  login,
  createQuestion,
  addAnswer,
  editAnswer,
  removeAnswer,
  uploadAvatar,
  seedDb,
};
