import { client } from "/imports/api/apollo/client/apolloClient";
import gql from "graphql-tag";
import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';
import { getFingerprint } from '/imports/api/fingerprint/getFingerprint';
import './MessageBox.html';
import { Messages } from '/imports/api/messages/client/Messages';

const { MessageBox } = Template;

const INSERT_MESSAGE_MUTATION = gql`
    mutation insertMessage($_id: String, $content: String!, $authorFingerprint: String!) {
        insertMessage(_id: $_id, content: $content, authorFingerprint: $authorFingerprint) {
            _id
            created_at
            content
            authorName
        }
    }
`;

MessageBox.onRendered(function onMessageBoxRendered() {
    const template = this;

    template.$('textarea#message').characterCounter();
});

MessageBox.events({
    'keypress textarea'(event) {
        if (event.which === 13 && !event.shiftKey) {
            const template = Template.instance();

            template.$('form').submit();
        }
    },

    'submit form'(event) {
        event.preventDefault();

        const template = Template.instance();
        const $form = template.$(event.currentTarget);
        const formData = $form.serializeArray();

        const messageData = formData.find((data) => data.name === "message");
        const content = messageData.value.trim();

        if (!message) {
            Materialize.toast('Message cannot be empty', 4000);
            return;
        }

        if (message.length > 120) {
            Materialize.toast('Message must be under 120 characters!', 4000);
            return;
        }

        template.$('textarea').val('');

        const _id = Random.id();
        const created_at = (new Date().getTime()) / 1000;

        // Be optimistic.
        Messages.insert({
            _id,
            content,
            created_at,
            authorName: "Submitting..."
        });

        getFingerprint().then(function (fingerprint) {
            client
                .mutate({
                    mutation: INSERT_MESSAGE_MUTATION,
                    variables: {
                        _id,
                        content,
                        authorFingerprint: fingerprint
                    }
                })
                .then(function (result) {
                    Messages.upsert(result.data.insertMessage._id, result.data.insertMessage);
                })
        });
    },
});

export { MessageBox };
