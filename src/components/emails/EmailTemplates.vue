<template>
	<div v-if="currentUser">
		<!-- Options Modal -->
		<base-modal :show="openModal" :title="'Email Options'">
			<dropdown-select :options="emailStyleOpts" :title="'Email Style'" @model-change="emailStyleSelection"></dropdown-select>
			<dropdown-select :options="emailIntentOpts" :title="'Email Intent'" @model-change="emailIntentSelection"></dropdown-select>
			<div class="form-floating">
				<input type="text" v-model="targetAudience" class="form-control" :class="{ 'is-invalid': targetAudience === null || targetAudience.trim() === '' }" id="floatingInputValue" />
				<small class="text-muted ms-1">e.g. Small businesses, families, over 18, etc..</small>
				<label for="floatingInputValue">Target Audience</label>
			</div>
			<template v-slot:buttons>
				<div class="d-flex justify-content-between">
					<FlippyButton :closeType="true" :title="'Close'" @click="openModal = false" />
					<FlippyButton :disabled="!validForm" :title="!validForm ? 'Not Yet' : 'Create'" @click="!validForm ? null : getEmailTemplates()" :class="{ disabled: !validForm }" />
				</div>
			</template>
		</base-modal>
		<!-- Page Title -->
		<h1 class="text-center">{{ emailTemplates ? 'Email Templates' : 'Create Email Templates' }}</h1>
		<h5 class="text-center">You have used {{ emailCount }}/5 email templates.</h5>
		<div class="center-content" :class="{ main: !emailTemplates }">
			<!-- Email Templates -->
			<div v-if="emailTemplates" class="marketing-guide container mb-5">
				<div v-for="(template, index) in emailTemplates" :key="index" class="mt-4">
					<div class="d-flex justify-content-between align-items-center mb-2">
						<h3 class="mb-0">Email #{{ index + 1 }}</h3>
						<div class="d-flex justify-content-end align-items-center">
							<p v-show="isSaved && editEmail === index" class="text-success mb-0 me-2">SAVED!</p>
							<ShineButton v-if="editEmail !== index && $route.name !== 'dashboard'" :title="'Edit'" @click="editEmail = index" />
							<ShineCloseButton v-else-if="editEmail === index && $route.name !== 'dashboard'" :title="'Close'" @click="editEmail = null" />
						</div>
					</div>
					<QuillEditor v-if="editEmail === index" theme="snow" toolbar="full" :contentType="'html'" :content="template.content" @update:content="(content) => saveEdit(content, index)" />
					<div v-else>{{ template.content }}</div>
				</div>
			</div>
			<!-- Create/Upgrade Buttons -->
			<FlippyButton v-if="!loading && emailCount < 5 && $route.name !== 'dashboard'" @click="openModal = true" :title="emailCount === 0 ? 'Create' : 'More?'" class="mb-5 mt-2" />
			<FlippyButton
				v-if="!loading && emailCount >= 5 && $route.name !== 'dashboard'"
				:disabled="true"
				@click="null"
				:title="'Upgrade Tier'"
				class="mb-5 mt-2"
				:class="{ disabled: !validForm }" />
			<!-- Loading -->
			<div v-if="loading" class="mt-5">
				<LoadingHand />
				<div class="mt-5 mb-5">
					<transition name="slide-fade" mode="out-in">
						<span class="load-status h4" :key="loadStatus">{{ loadStatus }}</span>
					</transition>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { useGptRequestsStore } from '@/stores/gptRequests.js';
import { useAuthStore } from '@/stores/auth.js';
import LoadingHand from '@/components/ui/LoadingHand.vue';
import FlippyButton from '@/components/ui/FlippyButton.vue';
import ShineButton from '@/components/ui/ShineButton.vue';
import ShineCloseButton from '@/components/ui/ShineCloseButton.vue';

function debounce(func, wait) {
	let timeout;
	return function (...args) {
		const context = this;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.apply(context, args);
		}, wait);
	};
}

export default {
	components: {
		LoadingHand,
		FlippyButton,
		ShineButton,
		ShineCloseButton,
	},
	inject: ['currentUser', 'userId'],
	data() {
		return {
			requestsStore: useGptRequestsStore(),
			authStore: useAuthStore(),
			companyName: this.currentUser.companyName,
			industry: this.currentUser.industry,
			targetAudience: null,
			emailStyle: null,
			emailStyleOpts: ['Normal', 'Funny', 'Professional', 'Serious', 'Funny and Professional', 'Out of the box'],
			emailIntent: null,
			emailIntentOpts: ['Visit my website', 'Purchase my product(s)', 'Follow my socials'],
			loading: false,
			loadStatus: 'Checking your info...',
			openModal: false,
			editEmail: null,
			saveEdit: null,
			isSaved: false,
		};
	},
	mounted() {
		this.saveEdit = debounce(this.saveEditImpl, 1500);
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
		validForm() {
			return this.emailStyle !== null && this.targetAudience !== null && this.targetAudience.trim() !== '' && this.emailIntent !== null;
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
			this.targetAudience = null;
		},
		async saveEditImpl(content, index) {
			const templates = this.emailTemplates;
			templates[index].content = content.replace(/<[^>]*>/g, '');
			this.requestsStore.saveEditedEmail(templates, this.userId);
			this.isSaved = true;
			await new Promise((resolve) => setTimeout(resolve, 4000)); // Adjust delay as needed
			this.isSaved = false;
		},
		emailStyleSelection(val) {
			this.emailStyle = val;
		},
		emailIntentSelection(val) {
			this.emailIntent = val;
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

.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: opacity 0.6s ease, transform 0.6s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	opacity: 0;
}

.disabled {
	cursor: not-allowed;
}
p {
	min-height: 1em; /* Adjust as needed */
}
</style>
