const bcrypt = require('bcrypt');

const books = [
  { title: 'Hello', author: 'Pesho' },
  { title: 'Hello1', author: 'Pesho1' },
];

const TYPE_TEXT = 'Text';
const TYPE_SCALE = 'Scale';

const questions = [
  {
    id: '1',
    type: TYPE_SCALE,
    value:
      'How much do you use self-discipline?How much do you use self-discipline?',
  },
  { id: '2', type: TYPE_SCALE, value: 'Where do you like to go the most?' },
  { id: '3', type: TYPE_SCALE, value: 'How much do you work?' },
  { id: '4', type: TYPE_SCALE, value: 'Test q?' },
  { id: '5', type: TYPE_SCALE, value: 'Test q1?' },
];

const answers = [
  { id: '1', value: 7 },
  { id: '2', value: 7 },
  { id: '3', value: 7 },
  { id: '4', value: 7 },
  // { id: 2, type: TYPE_TEXT, value: 'I like going to the park the most', questionId: 2 },
];

const users = [
  {
    id: '1',
    firstName: 'Pesho1',
    surName: 'Ivanov1',
    email: 'a',
    password: bcrypt.hash('a', 10),
    questions: [
      { id: '1', answer: { id: '3' } },
      { id: '2', answer: { id: '4' } },
      { id: '3', answer: { id: '4' } },
      { id: '4', answer: { id: '4' } },
    ],
  },
  {
    id: '2',
    firstName: 'Pesho2',
    surName: 'Ivanov2',
    email: 'a2',
    password: bcrypt.hash('1234', 10),
    questions: [
      { id: '1', answer: { id: '2' } },
      { id: '3', answer: { id: '1' } },
    ],
  },
];

module.exports = {
  books,
  questions,
  answers,
  users,
};
