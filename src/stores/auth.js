import { defineStore } from 'pinia'
import Parse from 'parse/dist/parse.min.js'
import { useGptRequestsStore } from './gptRequests.js'

export const useAuthStore = defineStore({
	id: 'auth',

	state: () => ({
		signUpError: null,
		logInError: null,
		sessionToken: null,
		currentUser: null,
		userId: null,
		userLoading: true,
		vaar: "Parse/MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU/currentUser"
	}),

	getters: {
		returnSignUpError (state) {
			return state.signUpError
		},
		returnLogInError (state) {
			return state.logInError
		},
		returnCurrentUser (state) {
			return state.currentUser
		},
		returnCurrentUserId (state) {
			return state.userId
		},
		returnUserLoading (state) {
			return state.userLoading
		}
	},

	actions: {
		async fetchCurrentUser () {
			// const storedUser = localStorage.getItem('currentUser')
			const userId = localStorage.getItem('userId')
			if (userId) {
				// If user is found in local storage, parse and set it as the currentUser
				try {
					// this.currentUser = JSON.parse(storedUser)
					this.userId = userId
					const User = new Parse.User()
					const query = new Parse.Query(User)

					query.get(userId)
						.then((user) => {
							this.currentUser = user.attributes
							const requestsStore = useGptRequestsStore()
							if (user.attributes.marketingPlan !== undefined) requestsStore.marketingPlan = user.attributes.marketingPlan

							if (user.attributes.emailTemplates !== undefined) requestsStore.emailTemplates = user.attributes.emailTemplates
							requestsStore.emailCount = user.attributes.emailCount
							requestsStore.emailConversation = user.attributes.emailConversation

							if (user.attributes.postTemplates !== undefined) requestsStore.postTemplates = user.attributes.postTemplates
							requestsStore.postCount = user.attributes.postCount
							requestsStore.postConversation = user.attributes.postConversation
							this.userLoading = false
						})
				} catch (error) {
					console.error('Failed to parse the stored user:', error)
				}
			}
		},
		async logIn (email, password) {
			this.logInError = null
			try {
				const requestsStore = useGptRequestsStore()
				const user = await Parse.User.logIn(email, password)
				if (user.attributes.marketingPlan !== undefined) requestsStore.marketingPlan = user.attributes.marketingPlan
				if (user.attributes.emailTemplates !== undefined) requestsStore.emailTemplates = user.attributes.emailTemplates
				requestsStore.emailCount = user.attributes.emailCount
				requestsStore.emailConversation = user.attributes.emailConversation

				if (user.attributes.postTemplates !== undefined) requestsStore.postTemplates = user.attributes.postTemplates
				requestsStore.postCount = user.attributes.postCount
				requestsStore.postConversation = user.attributes.postConversation

				this.currentUser = user.attributes
				this.userId = user.id
				this.sessionToken = user.get('sessionToken')
				localStorage.setItem('currentUser', JSON.stringify(user))
				localStorage.setItem('userId', user.id)
				this.userLoading = false
			} catch (error) {
				this.logInError = error
			}
		},

		async signUp (email, password, industry, companyName) {
			this.signUpError = null
			const user = new Parse.User()
			user.set("username", email)
			user.set("password", password)
			user.set("email", email)
			user.set('industry', industry)
			user.set('companyName', companyName)

			try {
				await user.signUp()

			} catch (error) {
				this.signUpError = error
			} finally {
				this.logIn(email, password)
			}
		},

		logOut () {
			Parse.User.logOut()
			localStorage.removeItem('currentUser')
			localStorage.removeItem('userId')
			localStorage.removeItem("Parse/MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU/currentUser")
			this.currentUser = null
			this.sessionToken = null
			this.userId = null
		}
	}
})
