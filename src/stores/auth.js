import { defineStore } from 'pinia'
import Parse from 'parse/dist/parse.min.js'
import { useGptRequestsStore } from './gptRequests.js'
import { useWebsiteStore } from './website.js'
import { useStripeStore } from './stripe.js'

export const useAuthStore = defineStore({
	id: 'auth',

	state: () => ({
		signUpError: null,
		logInError: null,
		sessionToken: null,
		currentUser: null,
		userId: null,
		userLoading: true,
		subscriptionPlan: null,
		allPlans: [],
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
					query.include("subscriptionPlan")
					query.get(userId)
						.then((user) => {
							let plan = user.get("subscriptionPlan")
							this.subscriptionPlan = plan.attributes
							this.currentUser = user.attributes
							const requestsStore = useGptRequestsStore()
							const websiteStore = useWebsiteStore()
							websiteStore.websiteInfo = user.attributes.websiteInfo

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
			} else {
				this.userLoading = false
			}
		},
		async logIn (email, password) {
			this.logInError = null
			try {
				const requestsStore = useGptRequestsStore()
				const websiteStore = useWebsiteStore()
				const user = await Parse.User.logIn(email, password)
				if (user.attributes.marketingPlan !== undefined) requestsStore.marketingPlan = user.attributes.marketingPlan
				if (user.attributes.emailTemplates !== undefined) requestsStore.emailTemplates = user.attributes.emailTemplates
				requestsStore.emailCount = user.attributes.emailCount
				requestsStore.emailConversation = user.attributes.emailConversation

				if (user.attributes.postTemplates !== undefined) requestsStore.postTemplates = user.attributes.postTemplates
				requestsStore.postCount = user.attributes.postCount
				requestsStore.postConversation = user.attributes.postConversation

				this.currentUser = user.attributes
				websiteStore.websiteInfo = user.attributes.websiteInfo
				this.userId = user.id
				this.sessionToken = user.get('sessionToken')
				localStorage.setItem('currentUser', JSON.stringify(user))
				localStorage.setItem('userId', user.id)
				let plan = user.get("subscriptionPlan")
				this.subscriptionPlan = plan.attributes
				// if (plan) {
				// 	try {
				// 		await plan.fetch()
				// 		console.log(plan)
				// 		this.subscriptionPlan = plan.get('Name')
				// 	} catch (err) {
				// 		console.log(err)
				// 	}
				// }
				this.userLoading = false
			} catch (error) {
				this.logInError = error
			}
		},

		async signUp (email, password, industry, companyName) {
			this.signUpError = null
			const user = new Parse.User()
			let SubscriptionPlan = Parse.Object.extend("SubscriptionPlan")
			let query = new Parse.Query(SubscriptionPlan)

			try {
				let plan = await query.get('G9cvl6uiiP') // Free plan
				user.set('subscriptionPlan', plan)

				user.set("username", email)
				user.set("password", password)
				user.set("email", email)
				user.set('industry', industry)
				user.set('companyName', companyName)

				await user.signUp()
			} catch (error) {
				this.signUpError = error
			} finally {
				this.logIn(email, password)
			}
		},

		logOut () {
			const stripeStore = useStripeStore()
			Parse.User.logOut()
			localStorage.removeItem('currentUser')
			localStorage.removeItem('userId')
			localStorage.removeItem("Parse/MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU/currentUser")
			this.currentUser = null
			this.sessionToken = null
			this.userId = null
			stripeStore.userPaymentInfo = null
		},

		upgradePlan (selectedPlan) {
			let SubscriptionPlan = Parse.Object.extend("SubscriptionPlan")
			let planQuery = new Parse.Query(SubscriptionPlan)

			// Get the subscription plan using its ID
			planQuery.get(selectedPlan).then((plan) => {
				// Now that we have the plan, get the user
				let user = Parse.User.current()

				// Update the user's subscriptionPlan
				user.set("subscriptionPlan", plan.id)
				user.save()
				this.fetchCurrentUser()
			})

		},

		getPlans () {
			const SubscriptionsPlan = Parse.Object.extend("SubscriptionPlan")
			const query = new Parse.Query(SubscriptionsPlan)

			query.find().then((results) => {
				results.forEach(plan => {
					this.allPlans.push(plan.attributes)
				})

			}, (error) => {
				// error is an instance of Parse.Error
				console.error('Error while fetching SubscriptionsPlans: ', error)
			})

		},
		updateUserInfo (payload) {
			let user = Parse.User.current()
			user.set('email', payload.email)
			user.set('username', payload.userName)
			user.set('firstName', payload.firstName)
			user.set('lastName', payload.lastName)
			try {
				user.save()
			} catch (err) {
				console.log(err)
			} finally {
				this.fetchCurrentUser()
			}
		},
		updateBusinessDetails (payload) {
			let user = Parse.User.current()
			user.set('email', payload.email)
			user.set('username', payload.userName)
			user.set('firstName', payload.firstName)
			user.set('lastName', payload.lastName)
			try {
				user.save()
			} catch (err) {
				console.log(err)
			} finally {
				this.fetchCurrentUser()
			}
		}
	}
})
