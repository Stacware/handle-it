<template>
	<div class="text-center">
		<h1>Marketing Plan</h1>
		<button v-if="!loading && marketingPlan === null" @click="createMarketingPlan">Create Marketing Plan</button>
		<LoadingEyes v-if="loading" />
		<div v-if="marketingPlan" class="text-start class container">
			<pre>{{ marketingPlan }}</pre>
		</div>
	</div>
</template>

<script>
import { useGptRequestsStore } from '@/stores/gptRequests.js';
import LoadingEyes from '@/components/ui/LoadingEyes.vue';
export default {
	components: {
		LoadingEyes,
	},
	data() {
		return {
			requestsStore: useGptRequestsStore(),
			industry: 'Software Development',
			targetAudience: 'Small Businesses',
			loading: false,
		};
	},
	computed: {
		marketingPlan() {
			return this.requestsStore.returnMarketingPlan;
		},
	},
	methods: {
		createMarketingPlan() {
			this.loading = true;
			this.requestsStore.startMarketingPlan(
				`Could you outline a 5 step marketing strategy, specifically tailored for a ${this.industry} company targeting ${this.targetAudience}? I would like each step to include detailed actions, specific resources or tools needed, timelines for execution, and how to measure success. In addition, please provide strategies for lead generation, nurturing, and conversion, emphasizing on the best practices for converting small businesses into loyal customers.`
			);
			const intervalId = setInterval(async () => {
				await this.requestsStore.checkTaskStatus();
				if (this.marketingPlan) {
					clearInterval(intervalId); // Stop calling checkTaskStatus
					this.loading = false;
				}
			}, 10000); // Adjust the interval as needed
		},
	},
};
</script>
