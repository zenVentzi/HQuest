const typeDefs = `
type Book {
  title: String
  author: Author
}

type Author {
  books: [Book]
}

type Query {
  author: Author
}
`;

const resolvers = {
  Query: {
    author(root, args, context, info) {
      return {};
    },
  },
  Author: {
    books(author) {
      return {};
    },
  },
};

module.exports = { typeDefs, resolvers };
