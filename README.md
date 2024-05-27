# ConversaVue

A chat application that allows:
- user sign up
- log in
- user search (with username)
- 1 on 1 conversations
- realtime updates to messages


### Built with:
- [Vue3](https://vuejs.org/) with Composition API
- [Firebase](https://firebase.google.com/): Auth and Firestore
- [Vuetify](https://vuetifyjs.com/en/getting-started/installation/#installation): used [Material Design](https://m3.material.io/)
- [Vuelidate](https://vuelidate-next.netlify.app/)

### Data model:
Uses 2 collections in Firestore: `users` and `messages`.
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
