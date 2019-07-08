# PROJECT STRUCTURE

Client-server, communication goes like this:

React client communicates with the backend through the ApolloClient. It uses either graphql queries, mutations, or real-time subscriptions.

On the server-side, ApolloServer creates a context object on every (http/s, _ws/s works slightly differently_)request, then forwards it to the appropriate resolver. E.g. if client sends mutation called "addAnswer", ApolloServer calls the "addAnswer" resolver. Then the "addAnswer" resolver calls the appropriate "service/s". Just like in MVC applications, services is where the business logic is, that communicate with the DB.

The services and Mongoose models are passed down through dependecy injection.

> _Newcommer? DI is just a fancy expression for something super simple. Use it to show off one's badass, engineering "prowess"._

When the services finish their work, often return an object as the result. E.g. the "addAnswer" service will return the answer object that was added to the database. Then that object is converted via "gqlMapper" object that contains functions to convert the db object to a Graphql object. E.g. `gqlMapper.mapAnswerToGql(dbAnswer)` which will return the answer object in Graphql format. Then, the resolver function returns the graphql object. Then it gets sent back to the client.

TODO:

- Clarify expressions and give more detailed examples.
- Don't forget to drink water
- Learn to be funny
