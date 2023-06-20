import { defineStore } from 'pinia'
import Parse from 'parse/dist/parse.min.js'

export const useGptRequestsStore = defineStore({
	id: 'gptRequests',

	state: () => ({
		marketingPlan: null,
		emailTemplates: null,
		taskStatus: null,
	}),

	getters: {
		returnMarketingPlan (state) {
			return state.marketingPlan
		},
		returnEmailTemplates (state) {
			return state.emailTemplates
		},
	},

	actions: {
		async startMarketingPlan (payload) {
			Parse.initialize("MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU", 'A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ')
			Parse.serverURL = 'https://parseapi.back4app.com/'
			try {
				const response = await Parse.Cloud.run('startMarketingPlan', payload)
				this.taskStatus = response.taskStatus
				this.marketingPlan = response.marketingPlan
			} catch (error) {
				console.error(error)
			}
		},

		async startEmailTemplates (payload) {
			Parse.initialize("MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU", 'A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ')
			Parse.serverURL = 'https://parseapi.back4app.com/'
			try {
				const response = await Parse.Cloud.run('getEmails', payload)
				this.emailTemplates = response.emailTemplates
			} catch (error) {
				console.error(error)
			}
		},

		async getTaskStatus (userId) {
			Parse.initialize("MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU", 'A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ')
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
