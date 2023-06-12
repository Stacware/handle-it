export const marketingGuideMixin = {
	computed: {
		paragraphs () {
			// Split the content into paragraphs where there are double line breaks
			return this.marketingPlan.split(/\n{2,}/g)
		},
		title () {
			// Extract the first line as the title
			return this.paragraphs.shift()
		}
	},
};

