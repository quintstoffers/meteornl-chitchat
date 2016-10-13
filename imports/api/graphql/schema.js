import { Meteor } from 'meteor/meteor';
import generateAuthorName from 'adjective-adjective-animal';
import { makeExecutableSchema } from "graphql-tools";
import { Messages } from '/imports/api/messages/server/Messages';
import { Authors } from '/imports/api/authors/Authors';

export const typeDefs = [`
type Message {
  _id: String
  created_at: Int
  content: String
  authorName: String
}

type Query {
  recentMessages: [Message]
}

type Mutation {
  insertMessage(_id: String, content: String!, authorFingerprint: String!): Message
}

type Subscription {
  messageInserted: Message
}

schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
`];

export const resolvers = {
    Query: {
        recentMessages(root, args, context) {
            const query = {};
            const options = {
                limit: 10,
                sort: {
                    created_at: -1
                }
            };
            return Messages.find(query, options).fetch();
        },
    },

    Mutation: {
        insertMessage(root, args, context) {
            return Promise
                .resolve()
                .then(function () {
                    const author = Authors.findOne(args.authorFingerprint);

                    if (!author) {
                        const nameOptions = {
                            adjectives: 2,
                            format: 'title',
                        };
                        return generateAuthorName(nameOptions).then(Meteor.bindEnvironment(function (name) {
                            Authors.insert({
                                name,
                                fingerprint: args.authorFingerprint
                            });
                        }));
                    }
                })
                .then(function () {
                    let messageData = {
                        created_at: new Date(),
                        content: args.content,
                        authorFingerprint: args.authorFingerprint
                    };

                    if (args._id) {
                        messageData._id = args._id;
                    }

                    messageData._id = Messages.insert(messageData);

                    return messageData;
                });
        },
    },

    Subscription: {
        messageInserted(root, args, context) {
            return root.o;
        },
    },

    Message: {
        _id: (message) => message._id,
        created_at: (message) => message.created_at.getTime() / 1000,
        content: (message) => message.content,
        authorName: (message) => Authors.findOne({ fingerprint: message.authorFingerprint }).name
    },
};

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

export { schema, typeDefs, resolvers };
