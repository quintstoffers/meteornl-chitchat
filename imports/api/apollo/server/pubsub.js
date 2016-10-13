import { PubSub } from "graphql-subscriptions";
import { publishMessagesOplog } from "/imports/api/messages/server/publishMessagesOplog";

const pubsub = new PubSub();

publishMessagesOplog(pubsub);

export { pubsub };
