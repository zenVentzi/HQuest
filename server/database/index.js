const bcrypt = require('bcrypt');

const books = [{ title: 'Hello', author: 'Pesho' }, { title: 'Hello1', author: 'Pesho1' }];

const questions = [
  { id: 1, value: 'How much do you use self-discipline?' },
  { id: 2, value: 'Where do you like to go the most?' },
  { id: 3, value: 'How much do you work?' },
];

const TYPE_TEXT = 'Text';
const TYPE_RATING = 'Rating';

const answers = [
  { id: 1, type: TYPE_RATING, value: 7, questionId: 1 },
  { id: 2, type: TYPE_TEXT, value: 'I like going to the park the most', questionId: 2 },
];

const users = [
  {
    id: '1',
    firstName: 'Pesho1',
    surName: 'Ivanov1',
    email: 'a',
    password: bcrypt.hash('a', 10),
    questionIds: [1, 2, 3],
    answerIds: [1, 2, 3],
    // questions: [ {id: 1, value: }]
  },
  {
    id: '2',
    firstName: 'Pesho2',
    surName: 'Ivanov2',
    email: 'a2',
    password: bcrypt.hash('1234', 10),
    questionIds: [1, 2, 3],
    answerIds: [1, 2, 3],
  },
];

module.exports = {
  books,
  questions,
  answers,
  users,
};
