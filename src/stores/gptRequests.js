import { defineStore } from 'pinia'
import Parse from 'parse'

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
		},
	},

	actions: {
		async startMarketingPlan (payload) {
			Parse.initialize(process.env.BACK4APP_KEY, 'A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ')
			Parse.serverURL = 'https://parseapi.back4app.com/'
			try {
				const response = await Parse.Cloud.run('backgroundFunction', payload)
				this.taskStatus = response.taskStatus
				this.marketingPlan = response.marketingPlan
			} catch (error) {
				console.error(error)
			}
		},

		async getTaskStatus (userId) {
			Parse.initialize(process.env.BACK4APP_KEY, 'A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ')
			Parse.serverURL = 'https://parseapi.back4app.com/'
			try {
				const response = await Parse.Cloud.run('getTaskStatus', { userId })
				this.taskStatus = response.taskStatus
				if (response.taskStatus === 'complete') {
					const User = new Parse.User()
					const query = new Parse.Query(User)
					query.equalTo('objectId', userId)
					const user = await query.first()
					this.marketingPlan = user.get('marketingPlan')
				}
				return this.taskStatus
			} catch (error) {
				console.error(error)
				return null
			}
		},
	},
})
