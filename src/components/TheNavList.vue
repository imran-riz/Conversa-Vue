<script setup>
defineProps([
	"usersContacted",
	"recipient",
	"loadAllMessages",
	"signOutOfAccount"
]);
</script>


<template>
	<v-list-item>
		<v-btn
			class="text-none"
			variant="flat"
			color="primary"
			prepend-icon="mdi-chat-plus"
			rounded="xl"
			width="120px"
		>New chat</v-btn>
	</v-list-item>

	<v-list>
		<v-list-item v-for="user in usersContacted" :key="user.id"
			:class="{'selected-contacted-user-item': user.email === recipient.email}"
			:value="user"
			rounded="xl"
			prepend-icon="mdi-account"
			@click="loadAllMessages(user.email)"
			:active="user.email === recipient.email"
			style="margin-bottom: 5px;"
		>
			<v-list-item-title
				v-text="user.username"
			></v-list-item-title>
		</v-list-item>
		<br>
		<v-btn
			class="me-2 text-none bg-error-container"
			block
			rounded="xl"
			prepend-icon="mdi-logout"
			@click="signOutOfAccount"
		>Sign out</v-btn>
	</v-list>
</template>


<style scoped>
</style>