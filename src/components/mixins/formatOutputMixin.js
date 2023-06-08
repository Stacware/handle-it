// formatOutputMixin.js
export const formatOutputMixin = {
	methods: {
		formatMarketingStrategyResponse (marketingPlan) {
			if (!marketingPlan) {
				return '' // or return an error message
			}

			const sections = marketingPlan.split('Strategies for Lead Generation, Nurturing, and Conversion:')

			const stepsSection = sections[0]
			const strategiesSection = sections[1]
			const conversionPracticesSection = sections[2] || ''

			// Extract steps
			const stepsRegex = /Step \d+:\s([\s\S]+?)\n\n/g
			const stepsMatches = [...stepsSection.matchAll(stepsRegex)]

			const formattedSteps = stepsMatches.map((match, index) => {
				const stepContent = match[1]
				const [action, resources, timeline, measurement] = stepContent
					.split('\n')
					.slice(1)
					.map((line) => line.replace(/^\d+\.\s/, '').replace(/^([A-Za-z]+):\s/, '').trim())
				return `
			<div class="step">
			  <h3>Step ${index + 1}</h3>
			  <p>Action: ${action}</p>
			  <p>Resources/Tools: ${resources}</p>
			  <p>Timeline: ${timeline}</p>
			  <p>Measurement: ${measurement}</p>
			</div>
		  `
			})

			// Extract strategies
			const strategiesRegex = /Strategy \d+:\s([\s\S]+?)\n\n/g
			const strategiesMatches = [...strategiesSection.matchAll(strategiesRegex)]

			const formattedStrategies = strategiesMatches.map((match, index) => {
				const strategyContent = match[1]
				const [action, resources, timeline, measurement] = strategyContent
					.split('\n')
					.slice(1)
					.map((line) => line.replace(/^\d+\.\s/, '').replace(/^([A-Za-z]+):\s/, '').trim())
				return `
			<div class="strategy">
			  <h3>Strategy ${index + 1}</h3>
			  <p>Action: ${action}</p>
			  <p>Resources/Tools: ${resources}</p>
			  <p>Timeline: ${timeline}</p>
			  <p>Measurement: ${measurement}</p>
			</div>
		  `
			})

			// Extract conversion practices
			const conversionPractices = conversionPracticesSection.trim().split('\n')

			const formattedConversionPractices = conversionPractices.map((practice, index) => {
				return `
			<div class="conversion-practice">
			  <h3>Conversion Practice ${index + 1}</h3>
			  <p>${practice}</p>
			</div>
		  `
			})

			// Combine the formatted sections
			return `
		  <div class="formatted-marketing-plan">
			<h2>Steps:</h2>
			${formattedSteps.join('')}
			
			<h2>Strategies for Lead Generation, Nurturing, and Conversion:</h2>
			${formattedStrategies.join('')}
			
			<h2>Best Practices for Converting Small Businesses into Loyal Customers:</h2>
			${formattedConversionPractices.join('')}
		  </div>
		`
		},
	},
}
