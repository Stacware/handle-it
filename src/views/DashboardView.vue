<template>
	<div v-if="currentUser" class="container">
		<h1 class="text-center my-5" id="step-1">Dashboard</h1>
		<section class="row mb-5">
			<div class="col-12 col-md-4 mb-4 d-flex align-items-center justify-content-center">
				<FlippyCard
					id="step-2"
					:title="'Marketing Guide'"
					:count="requestsStore.marketingPlan !== undefined && requestsStore.marketingPlan !== null ? 1 : 0"
					:total="1"
					@click="goToPage('marketing')" />
			</div>
			<div class="col-12 col-md-4 mb-4 d-flex align-items-center justify-content-center">
				<FlippyCard id="step-3" :title="'Email Templates'" :count="requestsStore.emailCount" :total="totalCount" @click="goToPage('email')" />
			</div>
			<div class="col-12 col-md-4 mb-4 d-flex align-items-center justify-content-center">
				<FlippyCard id="step-4" :title="'Social Media'" :count="requestsStore.postCount" :total="totalCount" @click="goToPage('post')" />
			</div>
			<!-- <article class="marketing col-12">
				<MarketingPlan />
			</article>
			<article class="posts col-6">
				<PostTemplates />
			</article>
			<article class="emails col-6">
				<EmailTemplates />
			</article> -->
		</section>
		<section>
			<WebsiteInfo />
		</section>
	</div>
</template>
<script>
// import MarketingPlan from '@/components/marketing/MarketingPlan.vue';
// import EmailTemplates from '@/components/emails/EmailTemplates.vue';
// import PostTemplates from '@/components/posts/PostTemplates.vue';
import { useGptRequestsStore } from '@/stores/gptRequests.js';
import FlippyCard from '@/components/ui/FlippyCard.vue';
import WebsiteInfo from '@/components/dashboard/WebsiteInfo.vue';
export default {
	components: {
		// MarketingPlan,
		// EmailTemplates,
		// PostTemplates,
		FlippyCard,
		WebsiteInfo,
	},
	data() {
		return {
			requestsStore: useGptRequestsStore(),
		};
	},
	inject: ['currentUser', 'totalCount'],
	methods: {
		goToPage(page) {
			this.$router.push({ name: page });
		},
	},
};
</script>
<style scoped></style>
