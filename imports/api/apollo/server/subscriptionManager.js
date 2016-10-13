import { SubscriptionManager } from "graphql-subscriptions";
import { pubsub } from "/imports/api/apollo/server/pubsub";
import { schema } from "/imports/api/graphql/schema";

const subscriptionManager = new SubscriptionManager({
    schema,
    pubsub,
    setupFunctions: {
        messageInserted: (options, args) => ({
            'messages.insert': {},
        }),
    },
});

export { subscriptionManager };
