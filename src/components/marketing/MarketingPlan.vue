<template>
	<div v-if="currentUser">
		<h1 class="text-center">{{ marketingPlan ? 'Marketing' : 'Create a Marketing Plan' }}</h1>
		<div class="center-content" :class="{ main: !marketingPlan }">
			<FlippyButton v-if="!loading && marketingPlan === null && $route.name !== 'dashboard'" @click="createMarketingPlan" :title="'Create'" class="mb-5 mt-2" />
			<!-- <button v-if="!loading && marketingPlan === null && $route.name !== 'dashboard'" @click="createMarketingPlan" class="btn btn-sm btn-outline-primary">Create Marketing Plan</button> -->
			<div v-if="loading">
				<LoadingHand :loadStatus="loading" @stop-loading="loading = false" />
			</div>
			<div v-if="marketingPlan" class="marketing-guide container">
				<h1>{{ title }}</h1>
				<div v-for="(paragraph, index) in paragraphs" :key="index">
					<p>{{ paragraph }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { useGptRequestsStore } from '@/stores/gptRequests.js';
import { useAuthStore } from '@/stores/auth.js';
import LoadingHand from '@/components/ui/LoadingHand.vue';
import { marketingGuideMixin } from '@/components/mixins/marketingGuideMixin';
import FlippyButton from '@/components/ui/FlippyButton.vue';

export default {
	components: {
		LoadingHand,
		FlippyButton,
	},
	mixins: [marketingGuideMixin],
	inject: ['currentUser'],
	data() {
		return {
			requestsStore: useGptRequestsStore(),
			authStore: useAuthStore(),
			industry: this.currentUser.industry,
			targetAudience: 'small businesses and millenials',
			loadStatus: null,
			loadStatus: 'Checking your info...',
		};
	},
	watch: {
		marketingPlan(val) {
			if (val) this.loading = false;
		},
	},
	computed: {
		marketingPlan() {
			return this.requestsStore.returnMarketingPlan;
		},
		loading() {
			return this.requestsStore.marketingLoading;
		},
	},
	methods: {
		sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		},
		async createMarketingPlan() {
			this.loading = true;
			const payload = {
				payload: `Please generate a comprehensive marketing guide, strategy, and market analysis for a company operating in the ${this.industry} industry and targeting the ${this.targetAudience}.`,
				userId: this.authStore.userId,
			};
			// 	const payload = {
			// 		payload: `Could you provide a 5-step marketing strategy for a company in the ${this.industry} industry, targeting ${this.targetAudience}? Please include the following for each step:
			// 1. Action: Describe the specific tasks that need to be performed.
			// 2. Resources/Tools: Mention the tools or resources required to execute the action.
			// 3. Timeline: Specify when and how long each action should take.
			// 4. Measurement: Explain how success can be measured.

			// Additionally, please provide strategies for lead generation, nurturing, and conversion, with details for each strategy:
			// 1. Action: Describe the actions to be taken for lead generation, nurturing, and conversion.
			// 2. Resources/Tools: Mention the tools or resources required for each strategy.
			// 3. Timeline: Specify when and how long each strategy should be implemented.
			// 4. Measurement: Explain how success can be measured.

			// Lastly, please emphasize the best practices for converting small businesses into loyal customers.`,
			// 		userId: this.authStore.userId,
			// 	};
			this.requestsStore.startMarketingPlan(payload);
			// Start polling
			// this.pollTaskStatus();
		},

		async pollTaskStatus() {
			this.taskPollingInterval = setInterval(async () => {
				const taskStatus = await this.requestsStore.getTaskStatus(this.authStore.userId);
				if (taskStatus === 'complete') {
					clearInterval(this.taskPollingInterval);
					this.loading = false;
				}
			}, 5000); // Poll every 5 seconds
		},
	},
};
</script>

<style scoped>
.main {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 88vh;
}

.center-content {
	text-align: center;
}

.marketing-guide {
	text-align: left;
}

.marketing-guide > h1 {
	font-size: 1.5em;
	margin-bottom: 1em;
}

.marketing-guide > p {
	margin-bottom: 1em;
	line-height: 1.5;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: opacity 0.6s ease, transform 0.6s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	opacity: 0;
}
</style>
