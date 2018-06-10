const { PubSub } = require('graphql-subscriptions');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const pubsub = new PubSub();

const typeDefs = `
  type Book {
    title: String!
    author: String!
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    surName: String!
    questionIds: [Int!]!
    answerIds: [Int!]!
  }

  type Question {
    id: ID!
    value: String!
    answerId: Answer!
  }

  enum AnswerType {
    RATING
    TEXT
  }

  type Answer {
    id: ID!
    questionId: Int!
    type: AnswerType!
    value: String!
  }

  type Query {
    books: [Book!]!
    book(title: String): Book
    users(match: String): [User!]!
    user(id: ID!): User
  }

  type Mutation {
    addBook(title: String!, author: String!): Book!
    signUp(firstName: String!, surName: String!, email: String!, password: String!): String
    login(email: String!, password: String!): String
    # questions(ids: [Int!]!): [String!]!
    answers(ids: [Int!]!): [Answer!]!
  }

  type Subscription {
    bookAdded: Book!
  }
`;

const books = [
  { title: 'Hello', author: 'Pesho' },
  { title: 'Hello1', author: 'Pesho1' },
];

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
    id: '1', firstName: 'Pesho1', surName: 'Ivanov1', email: 'a', password: bcrypt.hash('a', 10),
    questionIds: [1, 2, 3], answerIds: [1, 2, 3],
    // questions: [ {id: 1, value: }]
  },
  {
    id: '2', firstName: 'Pesho2', surName: 'Ivanov2', email: 'a2', password: bcrypt.hash('1234', 10),
    questionIds: [1, 2, 3], answerIds: [1, 2, 3],
  },
];

const resolvers = {
  Query: {
    books(root, args, context, info) {
      return books;
    },
    book(root, args, context, info) {
      return books[0];
    },
    // questions(root, args, context, info) {
    //   if (!context.user) {
    //     throw new Error('You are not authorized!');
    //   }

    //   const user = users.find(user => user.id === args.userId);

    //   const matchingQuestions = user.questionIds.map(id =>
    //     questions.find(qs => qs.id === id));

    //   return matchingQuestions;
    // },
    // answers(root, args, context, info) {
    //   if (!context.user) {
    //     throw new Error('You are not authorized!');
    //   }

    //   const user = users.find(user => user.id === args.userId);      

    //   const matchingAnswers = user.answerIds.map(id =>
    //     answers.find(answ => answ.id === id));

    //   return matchingAnswers;
    // },
    users(root, args, context, info) {
      if (!context.user) {
        throw new Error('You are not authorized!');
      }

      const matchedUsers = users.filter((user) => {
        const name = `${user.firstName.toLowerCase()} ${user.surName.toLowerCase()}`;
        const match = args.match.toLowerCase();
        return name.includes(match);
      });

      return matchedUsers;
    },
    user(root, args, { user }) {
      if (!user) {
        throw new Error('You are not authorized!');
      }

      const matchingUser = users.find(usr => usr.id === args.id);

      return matchingUser;
    },
  },
  Mutation: {
    addBook(root, args, context, info) {
      const book = { title: args.title, author: args.author };
      books.push(book);

      const payload = {
        bookAdded: book,
      };

      pubsub.publish('bookAdded', payload);

      return book;
    },
    async signUp(_, {
      firstName, surName, email, password,
    }) {
      const user = {
        firstName,
        surName,
        email,
        password: await bcrypt.hash(password, 10),
      };


      users.push(user);

      // return json web token
      return jsonwebtoken.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1y' },
      );
    },
    login(_, { email, password }) {
      const user = users.find(usr => usr.email === email);

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
        { expiresIn: '1d' },
      );
    },
  },
  Subscription: {
    bookAdded: {
      resolve: payload => ({
        customData: payload,
      }),
      subscribe: () => pubsub.asyncIterator('bookAdded'),
    },
  },
};

module.exports = { typeDefs, resolvers };
