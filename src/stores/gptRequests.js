import axios from 'axios'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.js'
import Parse from 'parse/dist/parse.min.js'

export const useGptRequestsStore = defineStore({
	id: 'gptRequests',

	state: () => ({
		marketingPlan: null,
		taskId: null
	}),

	getters: {
		returnMarketingPlan (state) {
			return state.marketingPlan
		},
		returnTaskId (state) {
			return state.taskId
		}
	},

	actions: {
		async startMarketingPlan (payload) {
			try {
				const response = await axios.post('/api/start-marketing-plan', { payload })
				this.taskId = response.data.taskId
			} catch (error) {
				console.error(error)
			}
		},

		async checkTaskStatus () {
			const userStore = useAuthStore()
			try {
				const response = await axios.get(`/api/check-task/${this.taskId}`)
				if (response.data.status === 'complete') {
					this.marketingPlan = response.data.result[0].message.content
					const userId = userStore.userId
					const User = new Parse.User()
					const query = new Parse.Query(User)

					query.get(userId)
						.then((user) => {
							user.set('marketingPlan', this.marketingPlan)
							return user.save()
						})
					// .then((user) => {
					// 	console.log('The user has been updated')
					// }, (error) => {
					// 	console.error('Error while updating user: ', error)
					// })

				} else if (response.data.status === 'error') {
					console.log('error')
					console.error(response.data.error)
				}
			} catch (error) {
				console.error(error)
			}
		}
	}
})
