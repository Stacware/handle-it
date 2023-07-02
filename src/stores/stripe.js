import { defineStore } from 'pinia'
import Parse from 'parse/dist/parse.min.js'
import { useAuthStore } from './auth.js'


export const useStripeStore = defineStore({
	id: 'stripe',

	state: () => ({

	}),

	getters: {

	},

	actions: {
		async makePayment (paymentMethodId) {
			const authStore = useAuthStore()
			const user = Parse.User.current()
			if (!user.get('customerId')) {
				console.error('User does not have a Stripe customer ID')
				return
			}
			await Parse.Cloud.run('addNewPaymentMethod', {
				userId: user.id,
				customerId: user.get('customerId'),
				paymentMethodId: paymentMethodId,
			})

			const subscription = await Parse.Cloud.run('createStarterSubscription', {
				userId: user.id,
			})
			console.log(subscription)
			if (subscription.status === 'active' || subscription.status === 'incomplete') {
				authStore.fetchCurrentUser()
			}
		}

	}
})
