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
  return jsonwebtoken.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1y' });
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
  return jsonwebtoken.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

module.exports = {
  addBook,
  signUp,
  login,
};
