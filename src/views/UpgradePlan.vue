<template>
	<div>
		<div v-if="authStore.allPlans.length !== 0 && planChoice === null" class="cards-container container" :class="[lgScreen ? 'lg-container' : 'reg-container']">
			<UpgradeCard :plans="planFree[0].attributes" class="m-auto" />
			<UpgradeCard :plans="planStarter[0].attributes" class="m-auto" />
			<UpgradeCard :plans="planBusiness[0].attributes" class="m-auto" />
		</div>
	</div>
</template>

<script>
import UpgradeCard from '@/components/ui/UpgradeCard.vue';
import { useAuthStore } from '@/stores/auth.js';
import { useStripeStore } from '@/stores/stripe.js';
// import StarterPayment from '../components/upgrade/StarterPayment.vue';
export default {
	components: {
		UpgradeCard,
		// StarterPayment,
	},
	inject: ['plan', 'lgScreen'],
	data() {
		return {
			authStore: useAuthStore(),
			stripeStore: useStripeStore(),
			planChoice: null,
		};
	},
	computed: {
		planFree() {
			return this.authStore.allPlans.filter((plan) => plan.attributes.Name === 'Free');
		},
		planStarter() {
			return this.authStore.allPlans.filter((plan) => plan.attributes.Name === 'Starter');
		},
		planBusiness() {
			return this.authStore.allPlans.filter((plan) => plan.attributes.Name === 'Business');
		},
	},
	methods: {
		async createSubscription(payload) {
			this.stripeStore.makePayment(payload.paymentMethodId, payload.plan);
			// const user = Parse.User.current();
			// await Parse.Cloud.run('addNewPaymentMethod', {
			// 	userId: user.id,
			// 	customerId: user.get('customerId'),
			// 	paymentMethodId: paymentMethodId,
			// });

			// const subscription = await Parse.Cloud.run('createStarterSubscription', {
			// 	userId: user.id,
			// });
			// console.log(subscription);
			// handle the subscription result...
		},
		goTo(plan) {},
	},
};
</script>

<style scoped>
.cards-container {
	height: 100vh;
}

.reg-container > div {
	margin-bottom: 2rem !important;
}

.reg-container {
	margin-top: 5rem;
}

.lg-container {
	display: flex;
	justify-content: center;
	gap: 100px;
}
</style>
