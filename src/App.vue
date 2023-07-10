<template>
	<div class="app-container">
		<Navbar @help="start" />
		<LoadingSpinner v-if="userLoading" class="spinner" />
		<router-view v-if="!userLoading"> </router-view>
		<v-tour name="newUser" :steps="steps" />
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
			steps: [
				{
					target: '#step-1',
					header: {
						title: 'Welcome!',
					},
					content: 'Welcome to your dashboard!',
					params: {
						placement: 'top',
					},
				},
				{
					target: '#step-2',
					header: {
						title: 'Marketing Guide',
					},
					content: 'These cards display your total used/total allowed. Clicking this will take you to create/view your Marketing Guide, Strategy, and Analysis',
					params: {
						placement: 'top',
					},
				},
				{
					target: '#step-3',
					header: {
						title: 'Email Templates',
					},
					content: 'Create/View/Edit your email templates for marketing purposes.',
					params: {
						placement: 'top',
					},
				},
				{
					target: '#step-4',
					header: {
						title: 'Social Media Posts',
					},
					content: 'Create/View/Edit social media templates to post on all your socials. Short, simple and effective.',
					params: {
						placement: 'top',
					},
					// Change pages before showing this step and also do something after this step
					// before: (type) =>
					// 	new Promise(resolve => {
					// 		resolve(this.$router.push('/'))
					// 	}),
					// after: (type) =>
					// 	new Promise(resolve => {
					// 		resolve(this.help = false)
					// 	})
				},
				{
					target: '#step-5',
					header: {
						title: 'Welcome to your Marketing Guide!',
					},
					content: 'Here you can create and view your tailored Marketing Guide, Strategy, and Analysis for your industry!',
					params: {
						placement: 'top',
					},
					// Change pages before showing this step and also do something after this step
					before: (type) =>
						new Promise((resolve) => {
							resolve(this.$router.push({ name: 'marketing', params: { userId: this.userId } }));
						}),
				},
			],
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
		start() {
			if (this.$route.name.includes('dashboard')) {
				this.$tours['newUser'].start();
			} else {
				this.$router.push({ name: 'dashboard', params: { userId: this.userId } });
				this.$tours['newUser'].start();
			}
		},
	},
};
</script>

<style scoped>
.app-container {
	min-height: 100vh;
}
.spinner {
	margin: 40vh auto;
}

.upgrade-button {
	position: fixed;
	bottom: 20px;
	right: 20px;
	z-index: 1000;
	width: 150px;
}
</style>
