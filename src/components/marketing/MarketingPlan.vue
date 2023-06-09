<template>
	<div>
		<h1 class="text-center">{{ marketingPlan ? 'Marketing Plan' : 'Create a Marketing Plan' }}</h1>
		<div class="text-center" :class="{ main: !marketingPlan }">
			<button v-if="!loading && marketingPlan === null" @click="createMarketingPlan" class="btn btn-sm btn-outline-primary">Create Marketing Plan</button>
			<LoadingEyes v-if="loading" />
			<div v-if="marketingPlan" class="text-start class container">
				<!-- <div v-html="formatMarketingStrategyResponse(marketingPlan)"></div> -->
				{{ marketingPlan }}
			</div>
		</div>
	</div>
</template>

<script>
import { useGptRequestsStore } from '@/stores/gptRequests.js';
import { useAuthStore } from '@/stores/auth.js';
import LoadingEyes from '@/components/ui/LoadingEyes.vue';
import { formatOutputMixin } from '@/components/mixins/formatOutputMixin.js';
export default {
	components: {
		LoadingEyes,
	},
	mixins: [formatOutputMixin],
	data() {
		return {
			requestsStore: useGptRequestsStore(),
			authStore: useAuthStore(),
			industry: 'Coffee Shop',
			targetAudience: 'people',
			loading: false,
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
	},
	methods: {
		createMarketingPlan() {
			this.loading = true;
			const payload = {
				payload: `Could you provide a 5-step marketing strategy for a company in the ${this.industry} industry, targeting ${this.targetAudience}? Please include the following for each step:
		1. Action: Describe the specific tasks that need to be performed.
		2. Resources/Tools: Mention the tools or resources required to execute the action.
		3. Timeline: Specify when and how long each action should take.
		4. Measurement: Explain how success can be measured.

		Additionally, please provide strategies for lead generation, nurturing, and conversion, with details for each strategy:
		1. Action: Describe the actions to be taken for lead generation, nurturing, and conversion.
		2. Resources/Tools: Mention the tools or resources required for each strategy.
		3. Timeline: Specify when and how long each strategy should be implemented.
		4. Measurement: Explain how success can be measured.

		Lastly, please emphasize the best practices for converting small businesses into loyal customers.`,
				userId: this.authStore.userId,
			};
			this.requestsStore.startMarketingPlan(payload);

			// Start polling
			this.pollTaskStatus();
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
	text-align: center;
}
</style>
