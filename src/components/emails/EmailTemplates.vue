<template>
	<div v-if="currentUser">
		<base-modal :show="openModal" @close="openModal = false" @create="getEmailTemplates">
			<dropdown-select :options="['Normal', 'Funny', 'Professional', 'Serious', 'Funny and Professional', 'Out of the box']" :title="'Choose email style'"></dropdown-select>
		</base-modal>
		<h1 class="text-center">{{ emailTemplates ? 'Email Templates' : 'Create Email Templates' }}</h1>
		<h5 class="text-center">You have used {{ emailCount }}/5 email templates.</h5>
		<div class="center-content" :class="{ main: !emailTemplates }">
			<div v-if="emailTemplates" class="marketing-guide container mb-5">
				<div v-for="(template, index) in emailTemplates" :key="index" class="mt-4">
					<h3>Email #{{ index + 1 }}</h3>
					{{ template.content }}
				</div>
			</div>
			<FlippyButton v-if="!loading && emailCount < 5 && $route.name !== 'dashboard'" @click="openModal = true" :title="'Create'" class="my-5" />
			<FlippyButton v-if="!loading && emailCount >= 5 && $route.name !== 'dashboard'" @click="upgradeTier" :title="'Upgrade Tier'" class="my-5" />

			<div v-if="loading" class="mt-5">
				<LoadingHand :loadStatus="loading" @stop-loading="loading = false" />
			</div>
		</div>
	</div>
</template>

<script>
import { useGptRequestsStore } from '@/stores/gptRequests.js';
import { useAuthStore } from '@/stores/auth.js';
import LoadingHand from '@/components/ui/LoadingHand.vue';
import FlippyButton from '@/components/ui/FlippyButton.vue';
export default {
	components: {
		LoadingHand,
		FlippyButton,
	},
	inject: ['currentUser'],
	data() {
		return {
			requestsStore: useGptRequestsStore(),
			authStore: useAuthStore(),
			companyName: this.currentUser.companyName,
			industry: this.currentUser.industry,
			targetAudience: 'small businesses and millenials',
			emailStyle: 'funny',
			emailIntent: 'visit my website',
			loading: false,
			loadStatus: null,
			
			openModal: false,
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
		emailCount() {
			return this.requestsStore.returnEmailCount;
		},
	},
	methods: {
		sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		},
		async getEmailTemplates() {
			this.loading = true;

			this.openModal = false;
			let conversation = this.requestsStore.emailConversation || [];

			conversation.push({
				role: 'user',
				content: `You are an email marketing guru, can you provide me an email template that i can send to my customers to for maximum roi to ${this.emailIntent}. The email style must be ${this.emailStyle}. My company name is ${this.companyName} and i am in the ${this.industry} and my target audience is ${this.targetAudience}`,
			});

			const payload = {
				messages: conversation,
				userId: this.authStore.userId,
			};
			this.requestsStore.startEmailTemplates(payload);
			await this.sleep(2000);

			// this.loading = false //change to false when done with dev
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
		upgradeTier() {
			console.log('upgrade');
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

</style>
