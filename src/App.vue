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
			:title="upgradeHover ? 'Upgrade?' : 'Plan: ' + subscriptionPlan.Name"
			v-if="!userLoading && userId && $route.name !== 'upgrade'" />
	</div>
</template>
<script>
import { computed } from 'vue';
import Navbar from '@/components/ui/Navbar.vue';
import { useAuthStore } from '@/stores/auth.js';
import { useStripeStore } from '@/stores/stripe.js';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import FlippyButton from '@/components/ui/FlippyButton.vue';
import { useMediaQuery } from '@vueuse/core';
export default {
	components: {
		Navbar,
		LoadingSpinner,
		FlippyButton,
	},
	data() {
		return {
			authStore: useAuthStore(),
			stripeStore: useStripeStore(),
			upgradeHover: false,
			lgScreen: useMediaQuery('(min-width: 1024px)'),
			totalCount: 1,
		};
	},
	provide() {
		return {
			userId: computed(() => this.userId),
			currentUser: computed(() => this.currentUser),
			plan: computed(() => this.subscriptionPlan),
			lgScreen: computed(() => this.lgScreen),
			totalCount: computed(() => this.totalCount),
		};
	},
	created() {
		this.authStore.getPlans();
		this.stripeStore.getUserPaymentInfo();
		// switch (this.plan.Name) {
		// 	case 'Admin':
		// 		this.totalCount = 100;
		// 		break;
		// 	case 'Starter':
		// 		this.totalCount = 5;
		// 		break;
		// 	case 'Business':
		// 		this.totalCount = 30;
		// 		break;
		// 	default:
		// 		this.totalCount = 1;
		// }
	},
	watch: {
		subscriptionPlan() {
			switch (this.subscriptionPlan.Name) {
				case 'Admin':
					this.totalCount = 100;
					break;
				case 'Starter':
					this.totalCount = 5;
					break;
				case 'Business':
					this.totalCount = 30;
					break;
				default:
					this.totalCount = 1;
			}
		},
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
			this.$router.push({ name: 'upgrade', params: { userId: this.userId } });
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
	z-index: 1000;
}
</style>
