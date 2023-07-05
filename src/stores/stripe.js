import { defineStore } from 'pinia'
import Parse from 'parse/dist/parse.min.js'
import { useAuthStore } from './auth.js'


export const useStripeStore = defineStore({
	id: 'stripe',

	state: () => ({
		userPaymentInfo: null
	}),

	getters: {

	},

	actions: {

		async checkoutBusinessUser (payload) {
			console.log(payload)
			const stripe = window.Stripe('pk_live_51NPIe1HNcBL4SbOJSsekLZkCve1qtzYjKJ2ZsvHsrjsZ9cejUUhU2cfoLmhJed7nC1IuKcm3GffL3eYSOEc9Gzes0030kq9aPT')

			// Fetch checkout session
			const session = await Parse.Cloud.run('createBusinessCheckout', { email: payload.email, userId: payload.userId })

			// Redirect to checkout
			const result = await stripe.redirectToCheckout({ sessionId: session.sessionId })

			if (result.error) {
				console.error(result.error.message)
			}
		},
		async checkoutStarterUser (payload) {
			console.log(payload)
			const stripe = window.Stripe('pk_live_51NPIe1HNcBL4SbOJSsekLZkCve1qtzYjKJ2ZsvHsrjsZ9cejUUhU2cfoLmhJed7nC1IuKcm3GffL3eYSOEc9Gzes0030kq9aPT')

			// Fetch checkout session
			const session = await Parse.Cloud.run('createStarterCheckout', { email: payload.email, userId: payload.userId })

			// Redirect to checkout
			const result = await stripe.redirectToCheckout({ sessionId: session.sessionId })

			if (result.error) {
				console.error(result.error.message)
			}
		}
	}
})
