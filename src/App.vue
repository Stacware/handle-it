<template>
	<div class="app-container">
		<Navbar />
		<LoadingSpinner v-if="userLoading" class="spinner" />
		<router-view v-else></router-view>
	</div>
</template>
<script>
import { computed } from 'vue';
import Navbar from '@/components/ui/Navbar.vue';
import { useAuthStore } from '@/stores/auth.js';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
export default {
	components: {
		Navbar,
		LoadingSpinner,
	},
	data() {
		return {
			authStore: useAuthStore(),
		};
	},
	provide() {
		return {
			userId: computed(() => this.userId),
			currentUser: computed(() => this.currentUser),
		};
	},
	computed: {
		userId() {
			return this.authStore.returnCurrentUserId;
		},
		currentUser() {
			return this.authStore.returnCurrentUser;
		},
		userLoading() {
			return this.authStore.returnUserLoading;
		},
	},
};
</script>

<style scoped>
.app-container {
	height: 100vh;
}
.spinner {
	margin: 40vh auto;
}
</style>
