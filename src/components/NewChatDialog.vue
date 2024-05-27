<script setup>
import { ref } from "vue";
import { searchForUsers } from "../services/firebase_firestore.js";
import _ from "lodash";


const usersFound = ref([]);
const dialog = ref(false);
const searchUsername = ref("");


const debouncedSearch = _.debounce(async () => {
		if (searchUsername.value.trim() === "") {
			usersFound.value = [];
			return;
		}

		usersFound.value = await searchForUsers(searchUsername.value.toLowerCase().trim());
	},
	150
);
</script>


<template>
	<v-dialog
		class="text-center"
		v-model="dialog"
		max-width="500px"
	>
		<template v-slot:activator="{ props: activatorProps }">
			<v-btn
				class="text-none"
				v-bind="activatorProps"
				variant="flat"
				color="primary"
				prepend-icon="mdi-chat-plus"
				rounded="xl"
				width="120px"
			>New chat</v-btn>
		</template>

		<template v-slot:default="{ isActive }">
			<v-card
				class="pa-2"
				color="surface-container-high"
				title="Find someone to talk to"
				rounded="xl"
			>
				<v-card-text>
					<v-list
						class="bg-surface-container-high"
					>
						<v-list-item class="pa-0">
							<v-text-field
								class="border-b-lg"
								v-model="searchUsername"
								@input="debouncedSearch"
								placeholder="Perhaps... Elon Musk? 🚀"
								prepend-inner-icon="mdi-magnify"
								variant="solo-filled"
								hide-details="true"
								rounded="t-xl"
							>
							</v-text-field>
						</v-list-item>
						<div v-if="usersFound.length > 0">
							<v-list-item
								v-for="user in usersFound" :key="user"
								class="mb-1 pa-2 text-left"
								@click="isActive.value = false; $emit('newChatWith', user.email);"
								prepend-icon="mdi-account"
							>
								<v-list-item-title>{{ user?.username }}</v-list-item-title>
								<v-list-item-subtitle>{{ `${user?.first_name} ${user?.last_name}`}}</v-list-item-subtitle>
							</v-list-item>
						</div>
					</v-list>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						class="text-none mr-4 mb-4"
						text="Ah, forget it!"
						@click="isActive.value = false;"
						variant="tonal"
					></v-btn>
				</v-card-actions>
			</v-card>
		</template>
	</v-dialog>
</template>


<style scoped>
</style>