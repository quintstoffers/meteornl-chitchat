import { createApolloServer } from "meteor/apollo";
import { createApolloSubscriptionServer } from "/imports/api/apollo/server/createApolloSubscriptionServer";
import { schema } from "/imports/api/graphql/schema";
import { subscriptionManager } from "/imports/api/apollo/server/subscriptionManager";

createApolloServer({
    schema,
});

createApolloSubscriptionServer({
    subscriptionManager,
});
