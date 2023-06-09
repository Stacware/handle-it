import { Parse } from "parse"
import { useAuthStore } from './auth' // import authStore

export const useGptRequestsStore = defineStore({
	id: "gptRequests",

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
		async saveTaskStatusToBack4App (taskStatus) {
			const authStore = useAuthStore()
			const User = Parse.Object.extend("User")
			const query = new Parse.Query(User)
			const user = await query.get(authStore.userId)
			user.set("taskStatus", taskStatus)
			await user.save()
		},

		async saveMarketingPlanToBack4App (marketingPlan) {
			const authStore = useAuthStore()
			const User = Parse.Object.extend("User")
			const query = new Parse.Query(User)
			const user = await query.get(authStore.userId)
			user.set("marketingPlan", marketingPlan)
			await user.save()
		},

		async getTaskStatusFromBack4App () {
			const authStore = useAuthStore()
			const User = Parse.Object.extend("User")
			const query = new Parse.Query(User)
			const user = await query.get(authStore.userId)
			await user.fetch()
			return user.get("taskStatus")
		},

		async getMarketingPlanFromBack4App () {
			const authStore = useAuthStore()
			const User = Parse.Object.extend("User")
			const query = new Parse.Query(User)
			const user = await query.get(authStore.userId)
			await user.fetch()
			return user.get("marketingPlan")
		},

		async startMarketingPlan (payload) {
			try {
				const response = await axios.post('/.netlify/functions/start-marketing-plan-background', payload)

				if (response.status === 200) {
					await this.saveTaskStatusToBack4App('complete')
					await this.saveMarketingPlanToBack4App(response.data.marketingPlan)
				} else {
					console.error('Error:', response.data.error)
					await this.saveTaskStatusToBack4App('error')
				}
			} catch (error) {
				console.error(error)
			}
		},
		saveMarketingPlanToStore (marketingPlan) {
			this.marketingPlan = marketingPlan
		},
	},
})
