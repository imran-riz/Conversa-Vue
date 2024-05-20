<script setup>
import { nextTick, onBeforeMount, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { getCurrentUserAuth, signOutUser } from "../services/firebase_auth.js";
import {
	addNewMessage, addUserToUsersContacted, getUserDetailsWithEmail, registerMessageListener, messages, deleteAllMessages
} from "../services/firebase_firestore.js";
import MessageBubble	 from "../components/MessageBubble.vue";
import TheNavList from "../components/TheNavList.vue";


const router = useRouter();

let currentUserAuth = null;

const sender = ref({ id: null, email: null, first_name: "", last_name: "", users_contacted: []});
const recipient = ref({ id: null, email: null, first_name: "", last_name: "", users_contacted: []});
const searchEmail = ref("");
const userFound = ref("");
const newMessage = ref("");
const usersContacted = ref([]);
const drawer = ref(false);


const signOutOfAccount = () => {
   console.log("HomePage.signOutOfAccount -> signing out...");

   if (signOutUser()) {
      console.log("HomePage.signOutOfAccount -> User signed out successfully.");
      router.push("/");
		location.reload();
   }
   else {
      console.error(`HomePage.signOutOfAccount -> Failed to sign out of account.`);
   }
}


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
      recipient.value = userData;

      console.log(`HomePage.searchUser -> new recipient:`);
      console.log(recipient.value);

      await loadAllMessages();
   }
}


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


const clearAllMessages = async () => {
	// await deleteAllMessages();
	// messages.value = [];
}


onBeforeMount(async () => {
   currentUserAuth = await getCurrentUserAuth();
   sender.value = await getUserDetailsWithEmail(currentUserAuth.email);
   usersContacted.value = sender.value.users_contacted;
});
</script>


<template>
<v-app class="app">
	<v-navigation-drawer
		class="pa-2 bg-surface-container-high"
		v-model="drawer"
		app
	>
		<TheNavList
			:users-contacted="usersContacted"
			:recipient="recipient"
			:load-all-messages="loadAllMessages"
			:sign-out-of-account="signOutOfAccount"
		></TheNavList>
	</v-navigation-drawer>
	<v-app-bar flat>
		<v-app-bar-nav-icon
			color="smoke"
			@click="drawer = !drawer"
		></v-app-bar-nav-icon>
		<v-toolbar-title>
			{{ `${recipient.first_name} ${recipient.last_name}` }}
		</v-toolbar-title>
	</v-app-bar>
	<v-main>
		<v-container
			fluid
			fill-height
		>
			<v-row
				align="center"
				justify="center"
			>
				<v-col cols="12">
					<v-card
						v-if="!recipient.id"
						width="900px"
						color="surface"
						style="margin: auto; height: 200px"
					>
						<v-card-title>
							<h1 class="text-h2 text-center">
								Hey {{ sender.first_name }} 👋
							</h1>
						</v-card-title>
						<v-card-text
							style="text-align: center; min-height: 762px;"
						>
							<v-btn
								class="text-none"
								variant="flat"
								color="primary"
								prepend-icon="mdi-chat-plus"
								rounded="xl"
								width="120px"
							>New chat</v-btn>
						</v-card-text>
					</v-card>
					<v-card
						flat
						width="900px"
						style="margin: auto;"
					>
						<v-card-text>
							<v-list
								class="message-list"
								lines="two"
							>
								<v-list-item v-for="message in messages" :key="message.id">
									<MessageBubble
										:text-message="message.text_message"
										:user-name="message.sender_id === sender.id ? 'You' : recipient.first_name"
										:sent-on="message.sent_on"
									></MessageBubble>
								</v-list-item>
							</v-list>
						</v-card-text>

						<v-card-actions v-if="recipient.id"
							position="fixed"
							style="width: inherit"
						>
							<v-textarea
								class="new-message-textarea"
								label="New message"
								v-model="newMessage"
								variant="solo-filled"
								rows="1"
								max-rows="5"
								auto-grow
								rounded="xl"
								bg-color="surface-container-high"
								style="white-space: pre-line;"
								@keydown.enter="sendMessage($event)"
							>
								<template #append-inner>
									<v-btn
										rounded="xl"
										color="white"
										:disabled="newMessage.trim() === ''"
										append-icon="mdi-send-outline"
										@click="sendMessage()"
									></v-btn>
								</template>
							</v-textarea>
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
	max-width: 100vw;
	max-height: 100vh;
	overflow-y: auto;
}

.message-list {
	scroll-behavior: smooth;
}

.new-message-textarea {
	position: fixed;
	bottom: 0;
	width: inherit;
	z-index: 1000;
}
</style>