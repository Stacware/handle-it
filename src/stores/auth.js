import { defineStore } from 'pinia'
import Parse from 'parse/dist/parse.min.js'
import { useGptRequestsStore } from './gptRequests.js'
import { useWebsiteStore } from './website.js'
import { useStripeStore } from './stripe.js'

const User = Parse.User
const MarketingPlans = Parse.Object.extend("MarketingPlans")
const WebsiteInfo = Parse.Object.extend("WebsiteInfo")

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
		assignUserDetails (user, marketingPlan, emailTemplates, postTemplates, websiteInfo) {
			const requestsStore = useGptRequestsStore()
			const websiteStore = useWebsiteStore()

			if (marketingPlan) {
				requestsStore.marketingPlan = marketingPlan.get("plan")
			}

			if (emailTemplates.length) {
				requestsStore.emailTemplates = emailTemplates.map(template => template.toJSON())
				requestsStore.emailCount = user.attributes.emailCount
			}

			if (postTemplates.length) {
				requestsStore.postTemplates = postTemplates.map(template => template.toJSON())
				requestsStore.postCount = user.attributes.postCount
			}

			if (websiteInfo) {
				websiteStore.websiteInfo = websiteInfo.get("results")
			}

			this.currentUser = user.attributes
			this.userId = user.id
			this.sessionToken = user.get('sessionToken')
			let plan = user.get("subscriptionPlan")
			this.subscriptionPlan = plan.attributes
			this.userLoading = false
		},

		async fetchCurrentUser () {
			const userId = localStorage.getItem('userId')
			if (userId) {
				try {
					this.userId = userId
					const query = new Parse.Query(User)
					query.include("subscriptionPlan")

					const userPromise = query.get(userId)
					const marketingPlanQuery = new Parse.Query(MarketingPlans)
					marketingPlanQuery.equalTo("user", User.createWithoutData(userId))
					const marketingPlanPromise = marketingPlanQuery.first()

					const emailTemplateQuery = new Parse.Query("EmailTemplates")
					emailTemplateQuery.equalTo("user", User.createWithoutData(userId))
					const emailTemplatesPromise = emailTemplateQuery.find()

					const postTemplateQuery = new Parse.Query("PostTemplates")
					postTemplateQuery.equalTo("user", User.createWithoutData(userId))
					const postTemplatesPromise = postTemplateQuery.find()

					const websiteInfoQuery = new Parse.Query(WebsiteInfo)
					websiteInfoQuery.equalTo("user", User.createWithoutData(userId))
					const websiteInfoPromise = websiteInfoQuery.first()

					const [user, marketingPlan, emailTemplates, postTemplates, websiteInfo] = await Promise.all([userPromise, marketingPlanPromise, emailTemplatesPromise, postTemplatesPromise, websiteInfoPromise])
					this.assignUserDetails(user, marketingPlan, emailTemplates, postTemplates, websiteInfo)
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
				const user = await Parse.User.logIn(email, password)
				const marketingPlanQuery = new Parse.Query(MarketingPlans)
				marketingPlanQuery.equalTo("user", user)
				const marketingPlan = await marketingPlanQuery.first()

				const emailTemplateQuery = new Parse.Query("EmailTemplates")
				emailTemplateQuery.equalTo("user", user)
				const emailTemplates = await emailTemplateQuery.find()

				const postTemplateQuery = new Parse.Query("PostTemplates")
				postTemplateQuery.equalTo("user", user)
				const postTemplates = await postTemplateQuery.find()

				const websiteInfoQuery = new Parse.Query(WebsiteInfo)
				websiteInfoQuery.equalTo("user", user)
				const websiteInfo = await websiteInfoQuery.first()

				this.assignUserDetails(user, marketingPlan, emailTemplates, postTemplates, websiteInfo)

				localStorage.setItem('currentUser', JSON.stringify(user))
				localStorage.setItem('userId', user.id)
			} catch (error) {
				this.logInError = error
				console.log(error)
			}
		},

		async signUp (email, password, industry, companyName) {
			this.signUpError = null
			const user = new User()
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
				this.logIn(email, password)
			} catch (error) {
				this.signUpError = error
			}
		},

		logOut () {
			const stripeStore = useStripeStore()
			const requestsStore = useGptRequestsStore()

			Parse.User.logOut()
			localStorage.removeItem('currentUser')
			localStorage.removeItem('userId')
			localStorage.removeItem("Parse/MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU/currentUser")
			this.currentUser = null
			this.sessionToken = null
			this.userId = null
			requestsStore.marketingPlan = null
			stripeStore.userPaymentInfo = null
		},

		upgradePlan (selectedPlan) {
			let SubscriptionPlan = Parse.Object.extend("SubscriptionPlan")
			let planQuery = new Parse.Query(SubscriptionPlan)

			planQuery.get(selectedPlan).then((plan) => {
				let user = Parse.User.current()
				user.set("subscriptionPlan", plan)
				user.save()
				this.fetchCurrentUser()
			})
		},

		getPlans () {
			const SubscriptionsPlan = Parse.Object.extend("SubscriptionPlan")
			const query = new Parse.Query(SubscriptionsPlan)

			query.find().then((results) => {
				console.log(results)
				this.allPlans = results
			})
		},
		async updateBusinessDetails (payload) {

			const query = new Parse.Query(User)

			query.get(payload.userId)
				.then((user) => {
					// Update the user details
					user.set('industry', payload.industry)
					user.set('companyName', payload.companyName)
					user.set('subSector', payload.subSector)

					return user.save()
				})
				.then((response) => {
					this.fetchCurrentUser()
					console.log('Updated user', response)
				})
				.catch((error) => {
					console.error('Error while updating user: ', error)
				})
		},
		async updateUserInfo (payload) {

			const query = new Parse.Query(User)

			query.get(payload.userId)
				.then((user) => {
					// Update the user details
					user.set('email', payload.email)
					user.set('username', payload.username)
					user.set('firstName', payload.firstName)
					user.set('lastName', payload.lastName)

					return user.save()
				})
				.then((response) => {
					this.fetchCurrentUser()
					console.log('Updated user', response)
				})
				.catch((error) => {
					console.error('Error while updating user: ', error)
				})
		}


		// addEmailTemplate (newTemplate) {
		// 	let user = Parse.User.current()
		// 	user.add("emailTemplates", newTemplate)
		// 	user.save()
		// },

		// addPostTemplate (newTemplate) {
		// 	let user = Parse.User.current()
		// 	user.add("postTemplates", newTemplate)
		// 	user.save()
		// },

		// removeEmailTemplate (selectedTemplate) {
		// 	let user = Parse.User.current()
		// 	let templates = user.get("emailTemplates")
		// 	templates.splice(templates.indexOf(selectedTemplate), 1)
		// 	user.set("emailTemplates", templates)
		// 	user.save()
		// },

		// removePostTemplate (selectedTemplate) {
		// 	let user = Parse.User.current()
		// 	let templates = user.get("postTemplates")
		// 	templates.splice(templates.indexOf(selectedTemplate), 1)
		// 	user.set("postTemplates", templates)
		// 	user.save()
		// }
	}
})

