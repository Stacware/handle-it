<template>
	<div class="app-container">
		<Navbar />
		<LoadingSpinner v-if="userLoading" class="spinner" />
		<router-view v-if="!userLoading"></router-view>
		<FlippyButton
			@click="upgradePlan"
			@mouseenter="upgradeHover = true"
			@mouseleave="upgradeHover = false"
			class="upgrade-button"
			:title="upgradeHover ? 'Upgrade?' : 'Plan: ' + subscriptionPlan"
			v-if="!userLoading" />
	</div>
</template>
<script>
import { computed } from 'vue';
import Navbar from '@/components/ui/Navbar.vue';
import { useAuthStore } from '@/stores/auth.js';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import FlippyButton from '@/components/ui/FlippyButton.vue';
export default {
	components: {
		Navbar,
		LoadingSpinner,
		FlippyButton,
	},
	data() {
		return {
			authStore: useAuthStore(),
			upgradeHover: false,
		};
	},
	provide() {
		return {
			userId: computed(() => this.userId),
			currentUser: computed(() => this.currentUser),
			plan: computed(() => this.subscriptionPlan),
		};
	},
	computed: {
		userId() {
			return this.authStore.returnCurrentUserId;
		},
		currentUser() {
			return this.authStore.returnCurrentUser;
		},
		userLoading() {
			return this.authStore.returnUserLoading;
		},
		subscriptionPlan() {
			return this.authStore.subscriptionPlan;
		},
	},
	methods: {
		upgradePlan() {
			// this.authStore.upgradePlan('i9pESVCbnX');
			console.log('upgrade works need to go to new page and implement stripe/venmo/paypal');
		},
	},
};
</script>

<style scoped>
.app-container {
	height: 100vh;
}
.spinner {
	margin: 40vh auto;
}

.upgrade-button {
	position: fixed;
	bottom: 20px;
	right: 20px;
}
</style>
