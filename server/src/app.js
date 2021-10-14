const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
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
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      const user = await getUser(token);
      return { user, pool };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
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
