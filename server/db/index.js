const bcrypt = require('bcrypt');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const DBName = `hquest`;

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
    id: '1',
    type: TYPE_SCALE,
    possibleValues,
    value: 'q?',
    // 'How much do you use self-discipline?How much do you use self-discipline?',
  },
  {
    id: '2',
    type: TYPE_SCALE,
    possibleValues,
    value: 'Where do you like to go the most?',
  },
  {
    id: '3',
    type: TYPE_SCALE,
    possibleValues,
    value: 'How much do you work?',
  },
  {
    id: '4',
    type: TYPE_SCALE,
    possibleValues,
    value: 'Test q?',
  },
  {
    id: '5',
    type: TYPE_SCALE,
    possibleValues,
    value: 'Test q1?',
  },
];

const answers = [
  { id: '1', value: 2 },
  { id: '2', value: 2 },
  { id: '3', value: 2 },
  { id: '4', value: 2 },
  // { id: 2, type: TYPE_TEXT, value: 'I like going to the park the most', questionId: 2 },
];

const users = [
  {
    id: '1',
    firstName: 'Pesho1',
    surName: 'Ivanov1',
    email: 'a',
    password: bcrypt.hash('a', 10),
    avatarSrc: ``,
    questions: [
      { id: '1', answer: { id: '3' } },
      { id: '2', answer: { id: '4' } },
      { id: '3', answer: { id: '4' } },
      // { id: '4', answer: { id: '4' } },
    ],
  },
  {
    id: '2',
    firstName: 'Pesho2',
    surName: 'Ivanov2',
    email: 'a2',
    password: bcrypt.hash('1234', 10),
    avatarSrc: ``,
    questions: [
      { id: '1', answer: { id: '2' } },
      { id: '3', answer: { id: '1' } },
    ],
  },
];

const answer = { value: 5, email: `a@a.com` };
const answer1 = { value: 5, email: `a1@a.com` }; // email must be unique for each answer

const qsColl = [{ value: `How much..?`, answers: [answer, answer1] }];
// const answColl = [ { id, value, qId, author }];

function connect(onConnected) {
  const mongoURI = `mongodb+srv://zenVentzi:${
    process.env.MONGO_PASS
  }@cluster0-rsehw.mongodb.net/test?retryWrites=true`;

  MongoClient.connect(
    mongoURI,
    { useNewUrlParser: true },
    (err, client) => {
      if (err) {
        console.log(
          'Error occurred while connecting to MongoDB Atlas...\n',
          err
        );
        return;
      }
      console.log('MongoDB Atlas Connected...');
      onConnected(client.db(DBName));
      // client.close();
    }
  );
}

module.exports = {
  connect,
  books,
  questions,
  answers,
  users,
};