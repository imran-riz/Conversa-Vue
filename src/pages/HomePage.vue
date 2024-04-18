<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { getApp } from "../services/firebase.js";
import { collection, getFirestore, onSnapshot, or, and, orderBy, query, where } from "firebase/firestore";
import { getCurrentUserAuth, signOutUser } from "../services/firebase_auth.js";
import { addNewMessage, getUserDetailsWithEmail } from "../services/firebase_firestore.js";



const router = useRouter();

let currentUserAuth = null;
let sender = null;
let recipient = null;
let unsubscribe = null;

const searchEmail = ref("");
const userFound = ref("");
const textMsg = ref("");
const messages = ref([]);


/**
 * Used to sign out the current user account from the Firebase account
 */
const signOutOfAccount = () => {
  console.log("HomePage.signOutOfAccount -> signing out...");

  if (signOutUser()) {
    console.log("HomePage.signOutOfAccount -> User signed out successfully.");
    router.push("/");
  }
  else {
    console.error(`HomePage.signOutOfAccount -> Failed to sign out of account.`);
  }
}


/**
 * Used to search for a user
 * @param targetEmail Email of the user to search for
 */
const searchUser = async (targetEmail) => {
  if (targetEmail.trim() === "") return;

  console.log(`HomePage.searchUser -> searching for user with email: ${targetEmail}`);

  const userData = await getUserDetailsWithEmail(targetEmail);

  if (!userData) {
    console.log(`HomePage.searchUser -> user not found.`);
    userFound.value = "There's nobody with that email address.";
  }
  else {
    userFound.value = "Found";
    recipient = userData;

    console.log(`HomePage.searchUser -> user found with data:`);
    console.log(userData);
  }
}


// const loadAllMessages = async () => {
//   if (!recipient) return;
//
//   messages.value = await getAllMessages(sender.id, recipient.id);
//
//   console.log(`HomePage.loadAllMessages -> messages between ${sender.first_name} and ${recipient.first_name}:`);
//   console.log(messages.value);
// }


/**
 * Registers a message listener between the current sender and recipient. By doing so, all updates made in the firestore db
 * is fetched in real-time.
 */
const registerMessageListener = () => {
  if (!recipient) return;

  console.log(`HomePage.registerMessageListener -> registering a listener for messages from ${recipient.email}...`);

  if (unsubscribe) {
    unsubscribe();
    messages.value.length = 0;
  }

  const db = getFirestore(getApp);
  const messagesCollection = collection(db, "messages");

  const q = query(
      messagesCollection,
      or(
          and(
            where("sender_id", "==", sender.id),
            where("recipient_id", "==", recipient.id)
          ),
          and(
              where("sender_id", "==", recipient.id),
              where("recipient_id", "==", sender.id)
          ),
      ),
      orderBy("sent_on", "asc")
  );

  unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        messages.value.push(
            {
              id: change.doc.id,
              ...change.doc.data()
            }
        );

        console.log(`HomePage.registerMessageListener -> change detected. Messages:`);
        console.log(messages.value);
      }
    });
  });

  console.log(`HomePage.registerMessageListener -> listener registered.`);
}


/**
 * Used to send a message to another user
 */
const sendMessage = async () => {
  if (!recipient) return;

  console.log(`HomePage.sendMessage() -> attempting to send a message...`);

  const messageDoc = {
    sent_on: new Date().toLocaleString(),
    text_message: textMsg.value.trim(),
    sender_id: sender.id,
    recipient_id: recipient.id,
  }

  try {
    const docRef = await addNewMessage(messageDoc);
    textMsg.value = "";

    console.log(`HomePage.sendMessage() -> new message sent successfully! Doc ref:`);
    console.log(docRef);
  }
  catch (error) {
    console.error(`HomePage.sendMessage() -> failed to add message doc to db. Error: ${error.code}`);
  }
}


onBeforeMount(async () => {
  currentUserAuth = await getCurrentUserAuth();
  sender = await getUserDetailsWithEmail(currentUserAuth.email);
});
</script>


<template>
  <div>
    <div>
      <h1>Home</h1>
    </div>

    <div>
      <button @click="signOutOfAccount">Sign Out</button>
    </div>

    <br><br>
    <div>
        Message to: <input type="email" v-model="searchEmail" @keydown.enter="searchUser(searchEmail)">
        <button @click="searchUser(searchEmail)">Search</button>
        <br><label>{{ userFound }}</label>
    </div>

    <br><br>

    <div>
      <label for="">Your message</label><br>
      <textarea v-model="textMsg"></textarea>
      <button @click="sendMessage">Send</button>
    </div>

    <div style="width: 500px; height: 400px; max-height: 400px; overflow: scroll; border: 1px solid black">
      <div style="border: 1px solid gray; margin: 1px"
          v-for="message in messages"
      >
        <p>
          {{ message.text_message }}
        </p>
      </div>
    </div>

    <div>
      <button @click="registerMessageListener">Load All Messages</button>
    </div>
  </div>
</template>



<style scoped>

</style>