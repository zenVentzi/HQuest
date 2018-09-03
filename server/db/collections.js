const BOOKS = `books`;
const QUESTIONS = `questions`;
const ANSWERS = `answers`;
const USERS = `users`;

const getCollections = db => ({
  books: db.collection(BOOKS),
  questions: db.collection(QUESTIONS),
  answers: db.collection(ANSWERS),
  users: db.collection(USERS),
});

module.exports = getCollections;
