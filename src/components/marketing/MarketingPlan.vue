<template>
	<div>
		<h1 class="text-center">{{ marketingPlan ? 'Marketing Plan' : 'Create a Marketing Plan' }}</h1>
		<div class="text-center" :class="{ main: !marketingPlan }">
			<button v-if="!loading && marketingPlan === null" @click="createMarketingPlan" class="btn btn-sm btn-outline-primary">Create Marketing Plan</button>
			<LoadingEyes v-if="loading" />
			<div v-if="marketingPlan" class="text-start class container">
				<div v-html="formatMarketingStrategyResponse(marketingPlan)"></div>
			</div>
		</div>
	</div>
</template>

<script>
import { useGptRequestsStore } from '@/stores/gptRequests.js';
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
		async createMarketingPlan() {
			const payload = `Could you provide a 5-step marketing strategy for a company in the ${this.industry} industry, targeting ${this.targetAudience}? Please include the following for each step:
							1. Action: Describe the specific tasks that need to be performed.
							2. Resources/Tools: Mention the tools or resources required to execute the action.
							3. Timeline: Specify when and how long each action should take.
							4. Measurement: Explain how success can be measured.
							
							Additionally, please provide strategies for lead generation, nurturing, and conversion, with details for each strategy:
							1. Action: Describe the actions to be taken for lead generation, nurturing, and conversion.
							2. Resources/Tools: Mention the tools or resources required for each strategy.
							3. Timeline: Specify when and how long each strategy should be implemented.
							4. Measurement: Explain how success can be measured.
							
							Lastly, please emphasize the best practices for converting small businesses into loyal customers.`;

			const callbackUrl = 'https://handle-it.netlify.app/.netlify/functions/callback-endpoint';

			try {
				const response = await axios.post('/.netlify/functions/start-marketing-plan-background', {
					payload: payload,
					callbackUrl: callbackUrl,
				});

				// Handle the response
				console.log(response.data);
			} catch (error) {
				console.error(error);
			}
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
