const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const typeDefs = `
type Book {
  title: String!
  author: String!
}

type Query {
  books: [Book!]!
}

type Mutation {
  addBook(title: String!, author: String!): Book!
}

type Subscription {
  bookAdded: Book!
}
`;

const books = [
  { title: 'Hello', author: 'Pesho' },
  { title: 'Hello1', author: 'Pesho1' },
];

const resolvers = {
  Query: {
    books(root, args, context, info) {
      return books;
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
