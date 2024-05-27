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
			class="mb-1 text-body-2"
			:value="user"
			rounded="xl"
			prepend-icon="mdi-account"
			@click="loadAllMessages(user.email)"
			:active="user.email === recipient.email"
		>
			<v-list-item-title
				v-text="user.username"
			></v-list-item-title>
			<template #append v-if="user.unread_counter > 0">
				<v-badge
					class="text-body-2"
					:content="user.unread_counter"
					color="error"
					bordered
					inline
					transition="fade-transition"
					style="zoom: 1.15"
				></v-badge>
			</template>
		</v-list-item>
		<br>
	</v-list>
</template>


<style scoped>
</style>