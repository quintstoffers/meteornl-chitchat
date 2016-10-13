import { client } from "/imports/api/apollo/client/apolloClient";
import gql from "graphql-tag";
import zenscroll from 'zenscroll';
import { Template } from "meteor/templating";
import { Messages } from '/imports/api/messages/client/Messages';
import "./MessageListItem";
import "./MessagesList.html";

const { MessagesList } = Template;

const RECENT_MESSAGES_QUERY = gql`
    query recentMessages {
        recentMessages {
            _id
            created_at
            content
            authorName
        }
    }
`;


const THING_INSERTED_SUBSCRIPTION = gql`
    subscription messageInserted {
        messageInserted {
            _id
            created_at
            content
            authorName
        }
    }
`;

MessagesList.onCreated(function onThingListCreated() {
    const template = this;



    // Query for initial list of things.
    client
        .query({
            query: RECENT_MESSAGES_QUERY,
        })
        .then((queryResult) => {
            queryResult.data.recentMessages.forEach(message => Messages.insert(message))
        });

    // Subscribe to additional things being inserted.
    template.messageInsertedObservable = client
        .subscribe({
            query: THING_INSERTED_SUBSCRIPTION
        })
        .subscribe({
            next(data) {
                Messages.upsert(data.messageInserted._id, data.messageInserted);

                // Remove oldest message when count is over 10
                if (Messages.find().count() > 10) {
                    const query = {};
                    const options = {
                        sort: {
                            created_at: 1
                        }
                    };
                    const oldestMessage = Messages.findOne(query, options);

                    Messages.remove(oldestMessage._id);
                }

                Meteor.setTimeout(function () {
                    if (template.scrollToLast) {
                        template.scrollToLast();
                    }
                }, 100);
            },
            error(err) {
                console.error(err)
            }
        });
});

MessagesList.onRendered(function onMessagesListRendered() {
    const template = this;

    template.scroller = zenscroll.createScroller(template.firstNode, 300, 25);
    template.scrollToLast = function () {
        const listItems = document.getElementsByClassName('message-list-item');

        if (listItems.length) {
            const bottomListItem = listItems[listItems.length - 1];

            template.scroller.intoView(bottomListItem)
        }
    };

    Meteor.setTimeout(function () {
        template.scrollToLast();
    }, 500)
});

MessagesList.onDestroyed(function onMessagesListDestroyed() {
    const template = this;

    template.messageInsertedObservable.unsubscribe();
});

MessagesList.helpers({
    messages() {
        const query = {};
        const options = {
            limit: 10,
            sort: {
                created_at: -1
            }
        };

        return Messages.find(query, options).fetch().reverse()
    },
});

export { MessagesList };
