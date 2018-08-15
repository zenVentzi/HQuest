const BOOKS = `books`;
const QUESTIONS = `questions`;
const ANSWERS = `answers`;
const USERS = `users`;

// module.exports = { books, questions, answers, users };
module.exports = db => ({
  books: db.collection(BOOKS),
  questions: db.collection(QUESTIONS),
  answers: db.collection(ANSWERS),
  users: db.collection(USERS),
});
