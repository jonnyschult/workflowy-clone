const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { typeDefs } = require("./typeDefs");
const { resolvers } = require("./resolvers");
const dotenv = require("dotenv");
const http = require("http");
const pool = require("./db/db");
const getUser = require("./middlewares/getUser");
dotenv.config();

const startApolloServer = async (typeDefs, resolvers) => {
  const app = express();
  const httpServer = http.createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      const user = await getUser(token, req);
      return { user, pool };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      // This `server` is the instance returned from `new ApolloServer`.
      path: server.graphqlPath,
    }
  );
  await server.start();
  server.applyMiddleware({ app });
  await new Promise((resolve) =>
    httpServer.listen({ port: process.env.PORT }, resolve)
  );
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
  );
};

startApolloServer(typeDefs, resolvers);
