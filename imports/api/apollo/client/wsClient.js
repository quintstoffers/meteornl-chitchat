import { Client } from 'subscriptions-transport-ws';

const WS_URL = Meteor.settings.public.WS_URL;

const wsClient = new Client(WS_URL);

export { wsClient };
