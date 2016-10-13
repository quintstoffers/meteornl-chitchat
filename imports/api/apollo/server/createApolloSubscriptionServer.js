import { createServer } from 'http';
import { SubscriptionServer  } from 'subscriptions-transport-ws';

const WS_URL = process.env.WS_URL || `localhost:4005`;
const wsUrlParts = WS_URL.split(':');
const WS_PORT = wsUrlParts[wsUrlParts.length - 1];

Meteor.settings.public.WS_URL = process.env.WS_URL || `localhost:4005`;

function createApolloSubscriptionServer({ subscriptionManager }) {
    const httpServer = createServer((request, response) => {
        response.writeHead(404);
        response.end();
    });
    httpServer.listen(WS_PORT, () => console.log(
        `Websocket Server is now running on http://localhost:${WS_PORT}`
    ));

    return new SubscriptionServer({ subscriptionManager }, httpServer);
}

export { createApolloSubscriptionServer };
