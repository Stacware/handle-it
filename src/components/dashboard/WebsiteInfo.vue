<template>
	<div>
		<div v-if="info" class="text-center my-5">
			<h2>Website</h2>
			<h5>info for {{ userWebsite }}</h5>
		</div>
		<div v-if="!info">
			<h5 class="text-center">Enter your website URL to get detailed information</h5>
			<div class="mb-3 px-5 input-group">
				<span class="input-group-text" id="website"><i class="bi bi-input-cursor-text"></i></span>
				<input :disabled="plan.Name === 'Free'" type="text" class="form-control" id="website" v-model="userWebsite" placeholder="google.com or www.google.com or https://google.com" />
			</div>
			<div class="text-center">
				<FlippyButton
					:disabled="!userWebsite"
					:title="plan.Name === 'Free' ? 'Upgrade' : !userWebsite ? 'Not yet...' : 'Show me!'"
					class="mt-2"
					:class="{ disabled: !userWebsite }"
					@click="!userWebsite ? null : getWebsiteInfo()" />
			</div>
		</div>

		<div v-if="info">
			<div class="row row-cols-1 row-cols-md-3 g-4">
				<div class="col d-flex align-items-center justify-content-center">
					<WebsiteCard :title="'First Indexed'" :value="moment(info.FirstIndexed).format('MM-DD-YYYY')" :description="'When this website was first indexed'" />
				</div>
				<div class="col d-flex align-items-center justify-content-center">
					<WebsiteCard :title="'Last Indexed'" :value="moment(info.LastIndexed).format('MM-DD-YYYY')" :description="'When this website was last indexed'" />
				</div>
				<div class="col d-flex align-items-center justify-content-center">
					<WebsiteCard :title="'Inc. Name'" :value="info.Meta.CompanyName === '' ? 'No valid name' : info.Meta.CompanyName" :description="'Valid incorporated company name'" />
				</div>
				<div class="col d-flex align-items-center justify-content-center">
					<WebsiteCard :title="'Industry'" :value="info.Meta.Vertical" :description="'Your websites found industry'" />
				</div>
				<div class="col d-flex align-items-center justify-content-center">
					<WebsiteCard :title="'Emails'" :value="info.Meta.Emails.length" :description="'Valid domain emails'" />
				</div>
				<div class="col d-flex align-items-center justify-content-center">
					<WebsiteCard :title="'Brand Followers'" :value="info.Attributes.Followers" :description="'Brand Followers i.e. 1000 = 1000-1999'" />
				</div>
				<div class="col d-flex align-items-center justify-content-center">
					<WebsiteCard :title="'ARank'" :value="info.Meta.ARank" :description="'Page Rank between 1 and 100,000,000, lower is better. Negative means not ranked'" />
				</div>
				<div class="col d-flex align-items-center justify-content-center">
					<WebsiteCard :title="'QRank'" :value="info.Meta.QRank" :description="'Transco Page Traffic Rank between 1 and 1,000,000, lower is better. Negative means not ranked'" />
				</div>
				<div class="col d-flex align-items-center justify-content-center">
					<WebsiteCard :title="'Majestic'" :value="info.Meta.Majestic" :description="'Majestic Rank between 1 and 1,000,000, lower is better. Negative means not ranked'" />
				</div>
				<div class="col d-flex align-items-center justify-content-center">
					<WebsiteCard
						:title="'Umbrella'"
						:value="info.Meta.Umbrella"
						:description="'Umbrella Global Router Traffic Rank between 1 and 1,000,000, lower is better. Negative means not ranked'" />
				</div>
				<div class="col d-flex align-items-center justify-content-center">
					<WebsiteCard :title="'Sitemaps'" :value="info.Attributes.Sitemap" :description="'Amount of sites in an indexable sitemap'" />
				</div>
				<div class="col d-flex align-items-center justify-content-center">
					<WebsiteCard :title="'Tags'" :value="info.Attributes.GTMTags" :description="'Amount of tags being loaded by Google Tag Manager'" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { useWebsiteStore } from '@/stores/website.js';
import WebsiteCard from './WebsiteCard.vue';
import moment from 'moment';
import FlippyButton from '@/components/ui/FlippyButton.vue';

export default {
	components: {
		WebsiteCard,
		FlippyButton,
	},
	data() {
		return {
			websiteStore: useWebsiteStore(),
			userWebsite: null,
		};
	},
	inject: ['userId', 'plan'],
	computed: {
		moment: () => moment,
		info() {
			return this.websiteStore.getWebsiteInfo;
		},
	},
	methods: {
		getWebsiteInfo() {
			this.websiteStore.fetchWebsiteInfo(this.userWebsite, this.userId);
		},
	},
};
</script>

<style scoped>
.disabled {
	cursor: not-allowed;
}
</style>
