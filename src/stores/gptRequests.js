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
		async startMarketingPlan (payload) {
			try {
				const response = await axios.post('/.netlify/functions/start-marketing-plan-background', payload)
				this.taskStatus = 'pending'
				console.log(response)
			} catch (error) {
				console.error(error)
			}
		},

		async getTaskStatus (userId) {
			try {
				const response = await axios.get('/.netlify/functions/get-task-status', {
					params: {
						userId: userId
					}
				})
				this.taskStatus = response.data.taskStatus
				return this.taskStatus
			} catch (error) {
				console.error(error)
				return null
			}
		},

	}
})
