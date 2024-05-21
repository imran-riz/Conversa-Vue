<script setup>
defineProps([
	"usersContacted",
	"recipient",
	"loadAllMessages",
	"signOutOfAccount"
]);
</script>


<template>
	<v-list>
		<v-list-item v-for="user in usersContacted" :key="user.id"
			class="mb-1"
			:value="user"
			rounded="xl"
			prepend-icon="mdi-account"
			@click="loadAllMessages(user.email)"
			:active="user.email === recipient.email"
		>
			<v-list-item-title
				v-text="user.username"
			></v-list-item-title>
		</v-list-item>
		<br>
	</v-list>
</template>


<style scoped>
</style>