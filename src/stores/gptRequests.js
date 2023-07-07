import { defineStore } from 'pinia'
import Parse from 'parse/dist/parse.min.js'

export const useGptRequestsStore = defineStore({
	id: 'gptRequests',

	state: () => ({
		marketingPlan: null,
		postTemplates: null,
		postCount: 0,
		postConversation: [],
		emailTemplates: [],
		emailCount: 0,
		emailConversation: [],
		emailLoading: false,
		taskStatus: null,
	}),

	getters: {
		returnMarketingPlan (state) {
			return state.marketingPlan
		},
		returnPostTemplates (state) {
			return state.postTemplates
		},
		returnPostCount (state) {
			return state.postCount
		},
		returnEmailTemplates (state) {
			return state.emailTemplates
		},
		returnEmailCount (state) {
			return state.emailCount
		}
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
			this.emailLoading = true
			Parse.initialize("MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU", 'A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ')
			Parse.serverURL = 'https://parseapi.back4app.com/'
			try {
				const response = await Parse.Cloud.run('getEmails', payload)
				console.log(response)
				this.emailTemplates.push(response.emailTemplate)
				this.emailCount = response.emailCount
				this.emailLoading = false
			} catch (error) {
				console.error(error)
			}
		},
		async saveEditedEmail (payload, userId) {
			Parse.initialize("MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU", 'A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ')
			try {
				const User = new Parse.User()
				const query = new Parse.Query(User)

				query.get(userId)
					.then((user) => {
						user.set('emailTemplates', payload)
						user.save()
					})
				// this.userLoading = false
			} catch (error) {
				console.error('Failed to parse the stored user:', error)
			}
		},
		async startPostTemplates (payload) {
			Parse.initialize("MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU", 'A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ')
			Parse.serverURL = 'https://parseapi.back4app.com/'
			try {
				const response = await Parse.Cloud.run('getPosts', payload)
				this.postTemplates = response.postTemplates
				this.postCount = response.postCount
				console.log(this.postCount)
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
