<template>
	<div>
		<h1 class="text-center">{{ emailTemplates ? 'Email Templates' : 'Create Email Templates' }}</h1>
		<div class="center-content" :class="{ main: !emailTemplates }">
			<button v-if="!loading && emailTemplates === null" @click="getEmailTemplates" class="btn btn-sm btn-outline-primary">Create Email Templates</button>
			<div v-if="loading">
				<LoadingHand />
				<div class="mt-5">
					<transition name="slide-fade" mode="out-in">
						<span class="load-status h4" :key="loadStatus">{{ loadStatus }}</span>
					</transition>
				</div>
			</div>
			<div v-if="emailTemplates" class="marketing-guide container">
				{{ emailTemplates }}
			</div>
		</div>
	</div>
</template>

<script>
import { useGptRequestsStore } from '@/stores/gptRequests.js';
import { useAuthStore } from '@/stores/auth.js';
import LoadingHand from '@/components/ui/LoadingHand.vue';
export default {
	components: {
		LoadingHand,
	},
	data() {
		return {
			requestsStore: useGptRequestsStore(),
			authStore: useAuthStore(),
			companyName: 'Stacware',
			industry: 'Software Development Company',
			targetAudience: 'small businesses and millenials',
			emailStyle: 'funny',
			emailIntent: 'visit my website',

			loading: false,
			loadStatus: 'Checking your info...',
		};
	},
	watch: {
		emailTemplates(val) {
			if (val) this.loading = false;
		},
	},
	computed: {
		emailTemplates() {
			return this.requestsStore.returnEmailTemplates;
		},
	},
	methods: {
		sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		},
		async getEmailTemplates() {
			this.loading = true;
			const payload = {
				payload: `You are an email marketing guru, can you provide me an email template that i can send to my customers to for maximum roi to ${this.emailIntent}. The email style must be ${this.emailStyle}. My company name is ${this.companyName} and i am in the ${this.industry} and my target audience is ${this.targetAudience}`,
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
			this.requestsStore.startEmailTemplates(payload);
			// await this.sleep(2000);
			// this.loadStatus = 'Creating marketing guide...';
			// await this.sleep(5000);
			// this.loadStatus = 'Creating strategy...';
			// await this.sleep(6000);
			// this.loadStatus = 'Gathering market analysis info...';
			// await this.sleep(5000);
			// this.loadStatus = 'Making it look nice...';
			// await this.sleep(4000);
			// this.loadStatus = 'A little magic...';
			// await this.sleep(4000);
			// this.loadStatus = 'Voila!';
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
