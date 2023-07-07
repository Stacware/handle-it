<template>
	<div v-if="currentUser">
		<!-- Options Modal -->
		<base-modal :show="openModal" :title="'Post Options'">
			<div class="modal-body">
				<div class="mb-3">
					<dropdown-select :options="postStyleOpts" :title="'Post Style'" @model-change="postStyleSelection"></dropdown-select>
				</div>
				<div class="mb-3">
					<dropdown-select :options="postIntentOpts" :title="'Post Intent'" @model-change="postIntentSelection"></dropdown-select>
				</div>
				<div class="mb-3">
					<dropdown-select :options="imageStyleOpts" :title="'Image Style'" @model-change="imageStyleSelection"></dropdown-select>
				</div>
				<div class="mb-3">
					<div class="form-floating">
						<input type="text" v-model="targetAudience" class="form-control" :class="{ 'is-invalid': targetAudience === null || targetAudience.trim() === '' }" id="floatingInputValue" />
						<label for="floatingInputValue">Target Audience</label>
						<small class="text-muted">e.g. Small businesses, families, over 18, etc..</small>
					</div>
				</div>
			</div>
			<div class="modal-footer d-flex justify-content-center w-100">
				<div class="d-flex justify-content-between flex-wrap w-100 mb-2">
					<FlippyButton :closeType="true" :title="'Close'" @click="openModal = false" class="mb-2" />
					<FlippyButton :disabled="!validForm" :title="!validForm ? 'Not Yet' : 'Create'" @click="!validForm ? null : getPostTemplates()" :class="{ disabled: !validForm }" />
				</div>
			</div>
		</base-modal>

		<!-- Page Title -->
		<h1 class="text-center">{{ postTemplates ? 'Social Media Posts' : 'Create Social Media Posts' }}</h1>
		<h5 class="text-center">You have used {{ postCount }}/{{ totalCount }} post templates.</h5>

		<div class="container">
			<div class="row justify-content-center mt-4">
				<div class="col-12 col-lg-8">
					<!-- Post Templates -->
					<div class="d-flex justify-content-center">
						<pagination
						:perPage="perPage"
						:totalItems="this.postTemplates.length"
						@paginatedItems="displayPages"/>
					</div>
					<div class="w-100">
						<div v-if="postTemplates" class="marketing-guide">
							<div v-for="(template, index) in filteredList" :key="index" class="mt-4">
								<h3>Post #{{ index + 1+ (currentPage - 1) * perPage }}</h3>
								<p>{{ template.id }}</p>
								<div v-if="editPost === template.id">
									<QuillEditor theme="snow" toolbar="full" :contentType="'html'" :content="template.content" @update:content="(content) => saveEdit(content, template.id)" />
									<!-- <ShineButton :title="'Save'" @click="savePost(index)" /> -->
									<div class="d-flex">
										<ShineCloseButton :title="'Cancel'" @click="editPost = null" />
										<h6 v-show="isSaved" class="text-success mb-0 ms-2 align-self-center">SAVED!</h6>
									</div>
								</div>
								<div v-else>
									{{ template.content }}
									<ShineButton :title="'Edit'" @click="editPost = template.id" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Create/Upgrade Buttons -->
			<div class="row justify-content-center mt-4">
				<div class="col-12 col-lg-8">
					<div class="d-grid gap-2">
						<FlippyButton v-if="!loading && postCount < totalCount && $route.name !== 'dashboard'" @click="openModal = true" :title="postCount === 0 ? 'Create' : 'More?'" class="mb-3" />
						<FlippyButton
							v-if="!loading && postCount >= totalCount && $route.name !== 'dashboard'"
							:disabled="true"
							@click="null"
							:title="'Upgrade Tier'"
							class="mb-3"
							:class="{ disabled: !validForm }" />
					</div>
				</div>
			</div>

			<div class="row justify-content-center mt-4">
				<div class="col-12 col-lg-8">
					<div>
						<LoadingHand :loadStatus="loading" :loaderContent="loader" />
					</div>
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
import Pagination from '../ui/Pagination.vue';
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
		Pagination,
		ShineButton,
		ShineCloseButton,
	},
	inject: ['currentUser', 'plan', 'totalCount', 'userId',],

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
			loadStatus: null,
			loader: 0,
			openModal: false,
			editPost: null,
			saveEdit: null,
			isSaved: false,
			currentPage: 1,
			perPage: 3,
		};
	},
	mounted() {
		this.saveEdit = debounce(this.saveEditImpl, 1500);
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

		// plan() {
		// 	switch (this.plan.Name) {
		// 		case 'Admin':
		// 			this.totalCount = 100;
		// 			break;
		// 		case 'Starter':
		// 			this.totalCount = 5;
		// 			break;
		// 		case 'Business':
		// 			this.totalCount = 30;
		// 			break;
		// 		default:
		// 			this.totalCount = 1;
		// 	}
		// },
	},
	computed: {
		loading() {
			return this.requestsStore.postLoading;
		},
		postTemplates() {
			return this.requestsStore.returnPostTemplates.reverse();
		},
		postCount() {
			return this.requestsStore.returnPostCount;
		},
		validForm() {
			return this.postStyle !== null && this.targetAudience !== null && this.targetAudience.trim() !== '' && this.postIntent !== null && this.imageStyle !== null;
		},
		filteredList() {
			return this.postTemplates.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage);
		},
	},
	methods: {
		sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		},
		async getPostTemplates() {
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
			this.targetAudience = null;
		},
		async saveEditImpl(content, id) {
			const templates = this.postTemplates;
			// templates[index].content = content.replace(/<[^>]*>/g, '');
			const editTemplate = templates.find(template => template.id === id); //set found template with matching UUID to editTemplate
			editTemplate.content = content.replace(/<[^>]*>/g, '');
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
			}, 10000); // Poll every 5 seconds
		},
		upgradeTier() {
			console.log('upgrade');
		},
		displayPages(pageNumber) {
			this.currentPage = pageNumber;
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
