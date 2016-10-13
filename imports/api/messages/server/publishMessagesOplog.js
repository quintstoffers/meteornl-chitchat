var OplogObservable = require('mongo-oplog-observable');

const oplogUrl = process.env.MONGO_OPLOG_URL || 'mongodb://127.0.0.1:4001/local';

var messagesOplogObserver = OplogObservable({
    uri: oplogUrl,
    ns: 'meteor.messages'
});

function publishMessagesOplog(pubsub) {
    messagesOplogObserver.subscribe(
        function onNext(event) {
            pubsub.publish('messages', event);

            switch (event.op) {
                case 'i':
                    pubsub.publish('messages.insert', event);
                    break;
                case 'u':
                    pubsub.publish('messages.update', event);
                    break;
                case 'd':
                    pubsub.publish('messages.remove', event);
                    break;
            }
        }
    );
}

export { publishMessagesOplog };
