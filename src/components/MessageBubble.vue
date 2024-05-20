<script setup>
defineProps([
	"textMessage",
	"userName",
	"sentOn",
]);
</script>


<template>
	<v-card
		class="message-bubble"
		:class="'message-bubble ' + (userName === 'You' ? 'message-bubble-sender bg-surface-container-low' : 'message-bubble-recipient bg-secondary-container')"
		rounded="xl"
	>
		<v-card-text>
			<p class="text-body-1">
				{{ textMessage }}
			</p>
		</v-card-text>
		<v-card-subtitle class="mb-3 text-body-2">
			<strong>{{ userName }}</strong> | {{ sentOn }}
		</v-card-subtitle>
	</v-card>
</template>


<style scoped>
.message-bubble {
	display: block;
	max-width: 592px;
}

.message-bubble-sender {
	float: right;
}

.message-bubble-recipient {
	float: left;
}
</style>