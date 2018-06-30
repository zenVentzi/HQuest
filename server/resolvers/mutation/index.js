const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const db = require('../../database');
const { pubsub } = require('../../PubSub');

function addBook(root, args, context, info) {
  const book = { title: args.title, author: args.author };
  db.books.push(book);

  const payload = {
    bookAdded: book,
  };

  pubsub.publish('bookAdded', payload);

  return book;
}

async function signUp(_, { firstName, surName, email, password }) {
  const user = {
    firstName,
    surName,
    email,
    password: await bcrypt.hash(password, 10),
  };

  db.users.push(user);

  // return json web token
  return jsonwebtoken.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1y' }
  );
}

function login(_, { email, password }) {
  const user = db.users.find(usr => usr.email === email);

  if (!user) {
    throw new Error('No user with that email');
  }

  const valid = bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error('Incorrect password');
  }

  // return json web token
  return jsonwebtoken.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

function editAnswer(_, { value, questionId }, context) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const userId = context.user.id;
  const dbUser = db.users.find(u => u.id === userId);
  const answeredQuestion = dbUser.questions.find(q => q.id === questionId);

  if (answeredQuestion) {
    const dbAnswer = db.answers.find(a => a.id === answeredQuestion.answer.id);
    dbAnswer.value = value;
    return answeredQuestion.answer.id;
  }

  const newAnswerId = db.answers.length + 1;
  db.answers.push({ id: newAnswerId, value });
  dbUser.questions.push({ id: questionId, answer: { id: newAnswerId } });
  return newAnswerId;
}

function removeQuestion(_, { questionId }, context) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const userId = context.user.id;
  const dbUser = db.users.find(u => u.id === userId);
  const i = dbUser.questions.findIndex(q => q.id === questionId);
  dbUser.questions.splice(i, 1);
  const removedQ = db.questions.find(q => q.id === questionId);

  return {
    id: questionId,
    type: removedQ.type,
    possibleValues: removedQ.possibleValues,
    value: removedQ.value,
  };
}

// function updateUserAnswer()

module.exports = {
  addBook,
  signUp,
  login,
  editAnswer,
  removeQuestion,
};
