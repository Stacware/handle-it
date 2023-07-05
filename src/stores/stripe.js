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
			const stripe = window.Stripe('pk_test_51NPIe1HNcBL4SbOJET7arjnDduQ0sWwYeBRSfm2dSK46gkWrJxbK71F105xkAVMa9Bka26HDcKKb1IZu0JUF6mOF00fMlOzKd1')

			// Fetch checkout session
			const session = await Parse.Cloud.run('createBusinessCheckoutSession', { email: payload.email, userId: payload.userId })

			// Redirect to checkout
			const result = await stripe.redirectToCheckout({ sessionId: session.sessionId })

			if (result.error) {
				console.error(result.error.message)
			}
		},
		async checkoutStarterUser (payload) {
			console.log(payload)
			const stripe = window.Stripe('pk_test_51NPIe1HNcBL4SbOJET7arjnDduQ0sWwYeBRSfm2dSK46gkWrJxbK71F105xkAVMa9Bka26HDcKKb1IZu0JUF6mOF00fMlOzKd1')

			// Fetch checkout session
			const session = await Parse.Cloud.run('createStarterCheckoutSession', { email: payload.email, userId: payload.userId })

			// Redirect to checkout
			const result = await stripe.redirectToCheckout({ sessionId: session.sessionId })

			if (result.error) {
				console.error(result.error.message)
			}
		}
	}
})
