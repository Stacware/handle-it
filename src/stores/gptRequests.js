import axios from 'axios'
import { defineStore } from 'pinia'
import Parse from 'parse/dist/parse.min.js'

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
			Parse.initialize(process.env.BACK4APP_KEY, null, process.env.MASTER_KEY)
			Parse.serverURL = 'https://parseapi.back4app.com/'
			try {
				const response = await axios.get('/.netlify/functions/get-task-status', {
					params: {
						userId: userId
					}
				})
				this.taskStatus = response.data.taskStatus
				if (response.data.taskStatus === 'complete') {
					const User = new Parse.User()
					const query = new Parse.Query(User)
					query.equalTo("objectId", userId)
					const user = await query.first({ useMasterKey: true })
					const marketingPlan = user.get("marketingPlan")
					this.marketingPlan = marketingPlan

				}
				return this.taskStatus
			} catch (error) {
				console.error(error)
				return null
			}
		},

	}
})
