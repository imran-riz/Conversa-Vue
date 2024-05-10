<script setup>
import { nextTick, onBeforeMount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { getCurrentUserAuth, signOutUser } from "../services/firebase_auth.js";
import { addNewMessage, addUserToUsersContacted, getUserDetailsWithEmail, registerMessageListener, messages } from "../services/firebase_firestore.js";



const router = useRouter();

let currentUserAuth = null;

const sender = ref({ id: null, email: null, first_name: "", last_name: ""});
const recipient = ref({ id: null, email: null, first_name: "", last_name: ""});
const searchEmail = ref("");
const userFound = ref("");
const newMessage = ref("");
const usersContacted = ref([]);


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
   if (recipientEmail) {
      if (recipientEmail === recipient.value.email) return;

      recipient.value = await getUserDetailsWithEmail(recipientEmail);
   }
   

   messages.value = [];
   registerMessageListener(sender.value.id, recipient.value.id);
   
   // console.log("Messages loaded: ");
   // console.log(messages.value);
   
   watch(messages, () => {
      nextTick(() => {
         scrollToBottomOfMessageList();
      });
   }, { immediate: true, deep: true });
   
}


/**
 * Used to send a message to another user. If this user does not already exist in the users contacted list, they will be added.
 */
const sendMessage = async (keyEvent = null) => {
   if (keyEvent?.shiftKey) return;

   if (!recipient.value.id) return;

   console.log(`HomePage.sendMessage() -> attempting to send a message...`);

   const messageDoc = {
      sent_on: new Date().toLocaleString(),
      text_message: newMessage.value,
      sender_id: sender.value.id,
      recipient_id: recipient.value.id,
   }

   try {
      const docRef = await addNewMessage(messageDoc);
      newMessage.value = "";

      // added the user to the userContacted list, if not present
      if (!usersContacted.value.find(user => user.id === recipient.value.id)) {
         usersContacted.value.push(recipient);
         await addUserToUsersContacted(sender.value.id, {
            id: recipient.value.id,
            email: recipient.value.email,
         });
      }

      console.log(`HomePage.sendMessage() -> new message sent successfully! Doc ref:`);
      console.log(docRef);
   }
   catch (error) {
      console.error(`HomePage.sendMessage() -> failed to add message doc to db. Error code: ${error.code}`);
      console.error(error);
   }

   scrollToBottomOfMessageList();
}


const scrollToBottomOfMessageList = () => {
   const messageListContainer = document.querySelector(".message-list");
   messageListContainer.scrollTop = messageListContainer.scrollHeight;
}


onBeforeMount(async () => {
   currentUserAuth = await getCurrentUserAuth();
   sender.value = await getUserDetailsWithEmail(currentUserAuth.email);
   usersContacted.value = sender.value.users_contacted;
});
</script>


<template>
   <v-app class="app">
      <v-navigation-drawer class="pa-2">
         <v-list>
            <v-list-item v-for="user in usersContacted" :key="user.id"
               :value="user"
               color="primary"
               rounded="xl"
               @click="loadAllMessages(user.email)"
               :active="user.email === recipient.email"
            >
               <v-list-item-title v-text="user.email"></v-list-item-title>
            </v-list-item>
         </v-list>
         <v-btn 
            class="me-2 text-none" 
            variant="outlined" block color="red"
            prepend-icon="mdi-logout"
            @click="signOutOfAccount"
         >Sign out</v-btn>
      </v-navigation-drawer>

      <v-app-bar 
         elevation="1"
         :title="`${recipient.first_name} ${recipient.last_name}`"
      ></v-app-bar>

      <v-main>
         <v-container fluid>
            <v-row>
               <v-col cols="12">
                  <v-card>
                     <v-card-text>
                        <v-list class="message-list" lines="two">
                           <v-list-item v-for="message in messages" :key="message.id">
                              <v-list-item-title>{{ message.text_message }}</v-list-item-title>
                              <v-list-item-subtitle>
                                 <strong>{{ message.sender_id === sender.id ? `You` : `${recipient.first_name}` }}</strong> | {{ message.sent_on }}
                              </v-list-item-subtitle>
                           </v-list-item>
                        </v-list>
                     </v-card-text>
                     
                     <v-card-actions>
                        <v-textarea
                           variant="outlined" 
                           label="New message" 
                           v-model="newMessage" 
                           rows="1"
                           autogrow
                           style="white-space: pre-line;"
                           @keydown.enter="sendMessage($event)"
                        ></v-textarea>
                        <v-btn color="primary" variant="outlined" @click="sendMessage()">Send</v-btn>
                     </v-card-actions>
                  </v-card>
               </v-col>
            </v-row>
         </v-container>
      </v-main>
   </v-app>
</template>



<style scoped>
.app {
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
}

.message-list {
  max-height: 60vh;
  overflow-y: auto;
  scroll-behavior: smooth;
}
</style>