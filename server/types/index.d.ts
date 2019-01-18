interface User {
  id: string;
  email: string;
}

interface ApolloContext {
  user?: User;
}

export { User, ApolloContext };
