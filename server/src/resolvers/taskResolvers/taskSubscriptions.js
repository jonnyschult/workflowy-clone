import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const postCreated = {
  subscribe: () => pubsub.asyncIterator(["POST_CREATED"]),
};

const resolvers = {
  Subscription: {
    postCreated,
  },
  // ...other resolvers...
};
