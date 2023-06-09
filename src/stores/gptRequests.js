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
				const response = await axios.post('/.netlify/functions/start-marketing-plan', payload)

				this.taskStatus = 'pending'
				console.log(response)
				// if (response.status === 202) {
				// 	const taskStatusEndpoint = response.headers['location']
				// 	console.log(taskStatusEndpoint)
				// 	await this.pollForResponse()
				// } else {
				// 	console.error('Error:', response.data.error)
				// 	this.taskStatus = 'error'
				// }
			} catch (error) {
				console.error(error)
			}
		}
	}
})
