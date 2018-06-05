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
}

type Query {
  books: [Book!]!
  users(match: String): [User!]!
  user(id: String!): User
}

type Mutation {
  addBook(title: String!, author: String!): Book!
  signUp(firstName: String!, surName: String!, email: String!, password: String!): String
  login(email: String!, password: String!): String
}

type Subscription {
  bookAdded: Book!
}
`;

const books = [
  { title: 'Hello', author: 'Pesho' },
  { title: 'Hello1', author: 'Pesho1' },
];

const users = [
  {
    id: '1', firstName: 'Pesho1', surName: 'Ivanov1', email: 'a1@a.com', password: bcrypt.hash('123', 10),
  },
  {
    id: '2', firstName: 'Pesho2', surName: 'Ivanov2', email: 'a2@a.com', password: bcrypt.hash('1234', 10),
  },
];

const resolvers = {
  Query: {
    books(root, args, context, info) {
      return books;
    },
    users(root, args, context, info) {
      if (!context.user) {
        throw new Error('You are not authorized!');
      }

      const matchedUsers = users.filter((user) => {
        const name = user.name.toLowerCase();
        const match = args.match.toLowerCase();
        return name.includes(match);
      });

      return matchedUsers;
    },
    user(_, args, { user }) {
      if (!user) {
        throw new Error('You are not authorized!');
      }

      return users.find(usr => usr.id === args.id);
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
