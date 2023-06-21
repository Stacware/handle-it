<template>
	<div>
		<h1>Dashboard</h1>
		<section class="row mb-5">
			<article class="marketing col-12">
				<MarketingPlan />
			</article>
			<article class="posts col-6">
				<PostTemplates />
			</article>
			<article class="emails col-6">
				<EmailTemplates />
			</article>
		</section>
	</div>
</template>
<script>
import MarketingPlan from '@/components/marketing/MarketingPlan.vue';
import EmailTemplates from '@/components/emails/EmailTemplates.vue';
import PostTemplates from '@/components/posts/PostTemplates.vue';
export default {
	components: {
		MarketingPlan,
		EmailTemplates,
		PostTemplates,
	},
};
</script>
<style scoped>

</style>
