# ConversaVue

A chat application that allows:
- user sign up
- log in
- user search (with username)
- 1 on 1 conversations
- realtime updates to messages


### Built with:
- Vue3 with Composition API
- Firebase: Auth and Firestore
- Vuetify (Material design 3)

### Data model:
There are 2 collections used in Firestore: `users` and `messages`.
```
user: {
    id: string,
    email: string,
    username: string,
    first_name: string,
    last_name: string,
    birthdate: string,
    users_contacted: [
        {
            id: string,
            email: string,
            unread_counter: number,
        }
    ]
}

message: {
    id: string,
    sender_id: string,
    recipient_id: string,
    text_message: string,
    sent_on: timestamp,
}
```