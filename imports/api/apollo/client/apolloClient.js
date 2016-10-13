import ApolloClient from 'apollo-client';
import { config } from '/imports/api/apollo/client/apolloClientConfig';

const client = new ApolloClient(config);

export { client };
