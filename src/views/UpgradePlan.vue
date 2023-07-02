<template>
	<div v-if="authStore.allPlans.length !== 0 && planChoice === null" class="cards-container container" :class="[lgScreen ? 'lg-container' : 'reg-container']">
		<UpgradeCard :plans="planFree[0]" class="m-auto" />
		<UpgradeCard :plans="planStarter[0]" class="m-auto" @click="planChoice = 'Starter'" />
		<UpgradeCard :plans="planBusiness[0]" class="m-auto" />
	</div>
	<div v-if="planChoice === 'Starter'">
		<StarterPayment />
	</div>
</template>

<script>
import UpgradeCard from '@/components/ui/UpgradeCard.vue';
import { useAuthStore } from '@/stores/auth.js';
import StarterPayment from '../components/upgrade/StarterPayment.vue';
export default {
	components: {
		UpgradeCard,
		StarterPayment,
	},
	inject: ['plan', 'lgScreen'],
	data() {
		return {
			authStore: useAuthStore(),
			planChoice: null,
		};
	},
	computed: {
		planFree() {
			return this.authStore.allPlans.filter((plan) => plan.Name === 'Free');
		},
		planStarter() {
			return this.authStore.allPlans.filter((plan) => plan.Name === 'Starter');
		},
		planBusiness() {
			return this.authStore.allPlans.filter((plan) => plan.Name === 'Business');
		},
	},
	methods: {
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
