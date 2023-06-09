import axios from 'axios'
import { defineStore } from 'pinia'
// import { useAuthStore } from './auth.js'
// import Parse from 'parse/dist/parse.min.js'

export const useGptRequestsStore = defineStore({
	id: 'gptRequests',

	state: () => ({
		marketingPlan: null,
		taskStatus: null,
	}),

	getters: {
		returnMarketingPlan (state) {
			return state.marketingPlan
		},
		returnTaskStatus (state) {
			return state.taskStatus
		}
	},
	actions: {
		// async startMarketingPlan (payload) {

		// 	try {
		// 		const response = await axios.post('/.netlify/functions/start-marketing-plan-background',
		// 			payload)

		// 		this.taskStatus = 'pending'

		// 		if (response.status === 200) {
		// 			this.taskStatus = 'complete'
		// 		} else {
		// 			console.error('Error:', response.data.error)
		// 			this.taskStatus = 'error'
		// 		}
		// 	} catch (error) {
		// 		console.error(error)
		// 	}
		// }
		async startMarketingPlan (payload) {
			try {
				const response = await axios.post('/.netlify/functions/start-marketing-plan-background', payload)

				this.taskStatus = 'pending'

				if (response.status === 202) {
					const taskStatusEndpoint = response.headers['location']
					await this.pollForResponse(taskStatusEndpoint)
				} else {
					console.error('Error:', response.data.error)
					this.taskStatus = 'error'
				}
			} catch (error) {
				console.error(error)
			}
		},

		async pollForResponse (endpoint) {
			const maxAttempts = 10
			const pollInterval = 5000 // 3 seconds
			let attempts = 0

			while (attempts < maxAttempts) {
				try {
					const response = await axios.get(endpoint)
					const data = response.data

					if (data.taskStatus === 'complete') {
						this.taskStatus = 'complete'
						const marketingPlan = data.marketingPlan
						console.log(marketingPlan)
						return // Exit the loop and function
					} else if (data.taskStatus === 'error') {
						console.error('Error:', data.error)
						this.taskStatus = 'error'
						return // Exit the loop and function
					}

					attempts++
					await new Promise(resolve => setTimeout(resolve, pollInterval))
				} catch (error) {
					console.error(error)
					this.taskStatus = 'error'
					return // Exit the loop and function
				}
			}

			console.error('Response not available within the specified number of attempts.')
			this.taskStatus = 'error'
		}

	}
})
