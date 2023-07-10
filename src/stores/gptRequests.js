import { defineStore } from 'pinia'
import Parse from 'parse/dist/parse.min.js'

export const useGptRequestsStore = defineStore({
	id: 'gptRequests',

	state: () => ({
		marketingPlan: null,
		marketingLoading: false,
		postTemplates: [],
		postCount: 0,
		postConversation: [],
		postLoading: false,
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
			this.marketingLoading = true
			Parse.initialize("MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU", 'A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ')
			Parse.serverURL = 'https://parseapi.back4app.com/'
			try {
				const response = await Parse.Cloud.run('startMarketingPlan', payload)
				this.taskStatus = response.taskStatus
				this.marketingPlan = response.marketingPlan
				this.marketingLoading = false
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
				this.emailTemplates.push({ template: response.emailTemplate })
				this.emailCount = response.emailCount
				this.emailLoading = false
			} catch (error) {
				console.error(error)
			}
		},
		async saveEditedEmail (payload, id) {
			Parse.initialize("MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU", 'A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ')
			try {
				const EmailTemplate = Parse.Object.extend('EmailTemplates')
				const query = new Parse.Query(EmailTemplate)

				const emailTemplate = await query.get(id)
				emailTemplate.set('template', { content: payload })
				await emailTemplate.save()
				const index = this.emailTemplates.findIndex(template => template.objectId === id)
				if (index !== -1) {
					this.emailTemplates[index].template = { content: payload }
				}
				console.log('Email template updated successfully')

			} catch (error) {
				console.error('Failed to update the email template:', error)
			}

		},
		async startPostTemplates (payload) {
			this.postLoading = true
			Parse.initialize("MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU", 'A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ')
			Parse.serverURL = 'https://parseapi.back4app.com/'
			try {
				const response = await Parse.Cloud.run('getPosts', payload)
				this.postTemplates.push({ template: response.postTemplate })
				this.postCount = response.postCount
				this.postLoading = false
			} catch (error) {
				console.error(error)
			}
		},

		async saveEditedPost (payload, id) {
			Parse.initialize("MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU", 'A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ')
			try {
				const PostTemplate = Parse.Object.extend('PostTemplates')
				const query = new Parse.Query(PostTemplate)

				const postTemplate = await query.get(id)
				postTemplate.set('template', { content: payload })
				await postTemplate.save()
				const index = this.postTemplates.findIndex(template => template.objectId === id)
				if (index !== -1) {
					this.postTemplates[index].template = { content: payload }
				}
				console.log('Post template updated successfully')

			} catch (error) {
				console.error('Failed to update the post template:', error)
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
