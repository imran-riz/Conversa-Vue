<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { getCurrentUserAuth, signOutUser } from "../services/firebase_auth.js";
import { addNewMessage, addUserToUsersContacted, getUserDetailsWithEmail, registerMessageListener, messages } from "../services/firebase_firestore.js";



const router = useRouter();

let currentUserAuth = null;
let sender = null;
let recipient = null;

const searchEmail = ref("");
const userFound = ref("");
const textMsg = ref("");
const usersContacted = ref([]);
// const messages = ref([]);


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

      console.log(`HomePage.searchUser -> new recipient:`);
      console.log(recipient);

      await loadAllMessages();
   }
}

/**
 * Ideally is called only once when a different recipient is selected or found via search.
 * 
 * @param recipientEmail - Optional. The email of the recipient. Should be provided only when a search is found.
 */
const loadAllMessages = async (recipientEmail = null) => {
   if (recipientEmail) recipient = await getUserDetailsWithEmail(recipientEmail);

   messages.value = [];
   registerMessageListener(sender.id, recipient.id);
   
   console.log("Messages loaded:");
   console.log(messages.value);
}


/**
 * Used to send a message to another user. If this user does not already exist in the users contacted list, they will be added.
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

      // added the user to the userContacted list, if not present
      if (!usersContacted.value.find(user => user.id === recipient.id)) {
         usersContacted.value.push(recipient);
        await addUserToUsersContacted(sender.id, {
          id: recipient.id,
          email: recipient.email,
        });
      }

      console.log(`HomePage.sendMessage() -> new message sent successfully! Doc ref:`);
      console.log(docRef);
   }
   catch (error) {
      console.error(`HomePage.sendMessage() -> failed to add message doc to db. Error code: ${error.code}`);
      console.error(error);
   }
}


onBeforeMount(async () => {
   currentUserAuth = await getCurrentUserAuth();
   sender = await getUserDetailsWithEmail(currentUserAuth.email);
   usersContacted.value = sender.users_contacted;
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
         <span>Recently contacted</span>
         <div>
               <ul>
                  <li v-for="user in usersContacted">
                     <button @click="loadAllMessages(user.email)">{{ user.email }}</button>
                  </li>
               </ul>
         </div>
      </div>

      <br><br>

      <div id="chat_feed" style="width: 500px; height: 400px; max-height: 400px; overflow: scroll; border: 1px solid black">
         <div style="border: 1px solid gray; margin: 1px"
            v-for="message in messages"
         >
            <p>
               {{ message.text_message }}
            </p>
         </div>
      </div>

      <br><br>

      <div>
         <label for="">Your message</label><br>
         <textarea v-model="textMsg"></textarea>
         <button @click="sendMessage">Send</button>
      </div>
   </div>
</template>



<style scoped>

</style>