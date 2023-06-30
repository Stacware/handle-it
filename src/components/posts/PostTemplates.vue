<template>
	<div v-if="currentUser">
		<!-- Options Modal -->
		<base-modal :show="openModal" :title="'Post Options'">
			<dropdown-select :options="postStyleOpts" :title="'Post Style'" @model-change="postStyleSelection"></dropdown-select>
			<dropdown-select :options="postIntentOpts" :title="'Post Intent'" @model-change="postIntentSelection"></dropdown-select>
			<dropdown-select :options="imageStyleOpts" :title="'Image Style'" @model-change="imageStyleSelection"></dropdown-select>
			<div class="form-floating">
				<input type="text" v-model="targetAudience" class="form-control" :class="{ 'is-invalid': targetAudience === null || targetAudience.trim() === '' }" id="floatingInputValue" />
				<small class="text-muted ms-1">e.g. Small businesses, families, over 18, etc..</small>
				<label for="floatingInputValue">Target Audience</label>
			</div>
			<template v-slot:buttons>
				<div class="d-flex justify-content-between">
					<FlippyButton :closeType="true" :title="'Close'" @click="openModal = false" />
					<FlippyButton :disabled="!validForm" :title="!validForm ? 'Not Yet' : 'Create'" @click="!validForm ? null : getPostTemplates()" :class="{ disabled: !validForm }" />
				</div>
			</template>
		</base-modal>
		<!-- Page Title -->
		<h1 class="text-center">{{ postTemplates ? 'Social Media Posts' : 'Create Social Media Posts' }}</h1>
		<h5 class="text-center">You have used {{ postCount }}/{{ totalCount }} post templates.</h5>
		<div class="center-content" :class="{ main: !postTemplates }">
			<!-- Post Templates -->
			<div v-if="postTemplates" class="marketing-guide container mb-5">
				<div v-for="(template, index) in postTemplates" :key="index" class="mt-4">
					<h3>Post #{{ index + 1 }}</h3>
					{{ template.content }}
				</div>
			</div>
			<!-- Create/Upgrade Buttons -->

			<FlippyButton v-if="!loading && postCount < totalCount && $route.name !== 'dashboard'" @click="openModal = true" :title="postCount === 0 ? 'Create' : 'More?'" class="mb-5 mt-2" />
			<FlippyButton
				v-if="!loading && postCount >= totalCount && $route.name !== 'dashboard'"
				:disabled="true"
				@click="null"
				:title="'Upgrade Tier'"
				class="mb-5 mt-2"
				:class="{ disabled: !validForm }" />
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
	},
	inject: ['currentUser', 'plan'],

	data() {
		return {
			requestsStore: useGptRequestsStore(),
			authStore: useAuthStore(),
			companyName: this.currentUser.companyName,
			industry: this.currentUser.industry,
			targetAudience: null,
			postStyle: null,
			postStyleOpts: ['Normal', 'Funny', 'Professional', 'Serious', 'Funny and Professional', 'Out of the box'],
			postIntent: null,
			postIntentOpts: ['Visit my website', 'Purchase my product(s)', 'Follow my socials'],
			imageStyle: null,
			imageStyleOpts: ['Digital Art', 'Cartoon', 'Realistic', 'Futuristic', 'Robot', 'Anything'],
			loading: false,
			loadStatus: 'Checking your info...',
			openModal: false,
			editPost: null,
			saveEdit: null,
			isSaved: false,
			totalCount: 0,
		};
	},
	mounted() {
		this.saveEdit = debounce(this.saveEditImpl, 1500);
		switch (this.plan.Name) {
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
	watch: {
		postTemplates(val) {
			if (val) this.loading = false;
		},
		plan() {
			switch (this.plan.Name) {
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
		postTemplates() {
			return this.requestsStore.returnPostTemplates;
		},
		postCount() {
			return this.requestsStore.returnPostCount;
		},
		validForm() {
			return this.postStyle !== null && this.targetAudience !== null && this.targetAudience.trim() !== '' && this.postIntent !== null && this.imageStyle !== null;
		},
	},
	methods: {
		sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		},
		async getPostTemplates() {
			this.loading = true;
			this.openModal = false;

			let conversation = this.requestsStore.postConversation || [];

			conversation.push({
				role: 'user',
				content: `You are an social media marketing guru, can you provide me an post template that i can send to my customers to for maximum roi to ${this.postIntent}. The post style must be ${this.postStyle}. My company name is ${this.companyName} and i am in the ${this.industry} and my target audience is ${this.targetAudience}. Give me an idea of an image I should include in this post as well. I'd like you to create a prompt for an AI Image generator as well for this in this style ${this.imageStyle}. And please only include the post and prompt for the image in your response. And separate the post from the image prompt please.`,
			});

			const payload = {
				messages: conversation,
				userId: this.authStore.userId,
			};
			this.requestsStore.startPostTemplates(payload);
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
		async saveEditImpl(content, index) {
			const templates = this.postTemplates;
			templates[index].content = content.replace(/<[^>]*>/g, '');
			this.requestsStore.saveEditedPost(templates, this.userId);
			this.isSaved = true;
			await new Promise((resolve) => setTimeout(resolve, 4000)); // Adjust delay as needed
			this.isSaved = false;
		},
		postStyleSelection(val) {
			this.postStyle = val;
		},
		postIntentSelection(val) {
			this.postIntent = val;
		},
		imageStyleSelection(val) {
			this.imageStyle = val;
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
</style>
