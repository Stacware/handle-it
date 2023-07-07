<template>
	<div>
		<h4 v-if="currentUser.stripeId" class="text-center">Payment Info</h4>
		<div v-if="currentUser.stripeId" class="text-center cont">
			<FlippyButton class="form-button-flippy" @click="createPortalSession" :title="'Manage Subscription'" />
		</div>
		<div v-else class="text-center">
			<h5>Free Plan</h5>
			<p>No payment info</p>
		</div>
	</div>
</template>

<script>
import { useStripeStore } from '@/stores/stripe.js';
import Parse from 'parse/dist/parse.min.js';
import FlippyButton from '@/components/ui/FlippyButton.vue';

export default {
	components: {
		FlippyButton,
	},
	inject: ['userId', 'plan', 'currentUser'],
	data() {
		return {
			stripeStore: useStripeStore(),
		};
	},
	methods: {
		async createPortalSession() {
			const session = await Parse.Cloud.run('createPortalSession', { userId: this.userId });
			window.location.href = session.url;
		},
	},
};
</script>

<style scoped>
.form-button-flippy {
	z-index: 2000;
}

.cont {
	margin-top: 22vh;
}
</style>
