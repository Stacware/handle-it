import axios from 'axios'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.js'
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
			const userStore = useAuthStore()
			const callbackUrl = 'https://handle-it.netlify.app/.netlify/functions/callback-endpoint'

			try {
				const response = await axios.post('/.netlify/functions/start-marketing-plan-background', {
					payload: payload,
					callbackUrl: callbackUrl,
				})

				this.taskStatus = 'pending'

				if (response.status === 200) {
					const marketingPlan = response.data.marketingPlan
					this.marketingPlan = marketingPlan
					this.taskStatus = 'complete'

					const User = new Parse.User()
					const query = new Parse.Query(User)

					query.get(userStore.userId).then((user) => {
						user.set('marketingPlan', this.marketingPlan)
						return user.save()
					})
				} else {
					console.error('Error:', response.data.error)
					this.taskStatus = 'error'
				}
			} catch (error) {
				console.error(error)
			}
		}



		// async checkTaskStatus () {
		// 	const userStore = useAuthStore()
		// 	try {
		// 		const response = await axios.get(`/.netlify/functions/check-task?userId=${userStore.userId}`)
		// 		if (response.data.status === 'complete') {
		// 			this.marketingPlan = response.data.result[0].message.content
		// 			this.taskStatus = null

		// 			const User = new Parse.User()
		// 			const query = new Parse.Query(User)

		// 			query.get(userStore.userId)
		// 				.then((user) => {
		// 					user.set('marketingPlan', this.marketingPlan)
		// 					return user.save()
		// 				})
		// 		} else if (response.data.status === 'error') {
		// 			console.log('error')
		// 			this.taskStatus = 'error'
		// 			console.error(response.data.error)
		// 		}
		// 	} catch (error) {
		// 		console.error(error)
		// 	}
		// }

	}
})
