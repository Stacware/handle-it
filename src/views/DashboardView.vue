<template>
	<div v-if="currentUser" class="container">
		<h1 class="text-center my-5">Dashboard</h1>
		<section class="d-flex justify-content-between mb-5">
			<div class="">
				<FlippyCard :title="'Marketing Guide'" :count="currentUser.marketingPlan !== undefined ? 1 : 0" :total="1" @click="goToPage('marketing')" />
			</div>
			<div class="">
				<FlippyCard :title="'Email Templates'" :count="currentUser.emailCount" :total="5" @click="goToPage('email')" />
			</div>
			<div class="">
				<FlippyCard :title="'Social Media'" :count="currentUser.postCount" :total="5" @click="goToPage('post')" />
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
	</div>
</template>
<script>
// import MarketingPlan from '@/components/marketing/MarketingPlan.vue';
// import EmailTemplates from '@/components/emails/EmailTemplates.vue';
// import PostTemplates from '@/components/posts/PostTemplates.vue';
import FlippyCard from '@/components/ui/FlippyCard.vue';
export default {
	components: {
		// MarketingPlan,
		// EmailTemplates,
		// PostTemplates,
		FlippyCard,
	},
	inject: ['currentUser'],
	methods: {
		goToPage(page) {
			this.$router.push({ name: page });
		},
	},
};
</script>
<style scoped></style>
