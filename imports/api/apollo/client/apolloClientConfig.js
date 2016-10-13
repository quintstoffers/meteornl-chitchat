import { meteorClientConfig } from "meteor/apollo";
import { print } from 'graphql-tag/printer';
import { wsClient } from "/imports/api/apollo/client/wsClient";

const config = meteorClientConfig();

Object.assign(
    config.networkInterface,
    {
        subscribe(request, handler) {
            const subscribeOptions = {
                query: print(request.query),
                variables: request.variables,
            };
            return wsClient.subscribe(subscribeOptions, handler);
        },
        unsubscribe(id) {
            wsClient.unsubscribe(id);
        },
    }
);

export { config }
