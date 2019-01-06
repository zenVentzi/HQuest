const books = [
  { title: 'Hello', author: 'Pesho' },
  { title: 'Hello1', author: 'Pesho1' },
];

const TYPE_TEXT = 'Text';
const TYPE_SCALE = 'Scale';

const possibleValues = [
  'Never',
  'Very rarely',
  'Rarely',
  'Sometimes',
  'Often',
  'Very often',
  'Always',
];

const questions = [
  {
    type: TYPE_SCALE,
    possibleValues,
    value: 'q?',
    // 'How much do you use self-discipline?How much do you use self-discipline?',
  },
  {
    type: TYPE_SCALE,
    possibleValues,
    value: 'Where do you like to go the most?',
  },
  {
    type: TYPE_SCALE,
    possibleValues,
    value: 'How much do you work?',
  },
  {
    type: TYPE_SCALE,
    possibleValues,
    value: 'Test q?',
  },
  {
    type: TYPE_SCALE,
    possibleValues,
    value: 'Test q1?',
  },
];

// const answers = [
//   { value: 2, questionId: ObjectID(`....`), authorId: ObjectID(`....`) },
// ];

const users = [
  {
    firstName: 'Pesho1',
    surName: 'Ivanov1',
    email: 'a',
    password: 'bla',
    avatarSrc: ``,
  },
  {
    firstName: 'Pesho2',
    surName: 'Ivanov2',
    email: 'a2',
    password: 'bla',
    // password: bcrypt.hashSync('1234', 10),
    avatarSrc: ``,
  },
];

// function generateAnswersFor(userId, ques)

module.exports = { books, questions, users };
