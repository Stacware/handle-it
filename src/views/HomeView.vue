<template>
	<div class="container d-flex justify-content-center align-items-center" style="height: 100vh">
		<transition name="flip" mode="out-in">
			<Login v-if="showLoginForm" key="login-form" @switch="showLoginForm = !showLoginForm" />
			<SignUp v-else key="signup-form" @switch="showLoginForm = !showLoginForm" />
		</transition>
	</div>
</template>

<script>
import Login from '../components/auth/Login.vue';
import SignUp from '../components/auth/Signup.vue';
import { useAuthStore } from '@/stores/auth.js';

export default {
	components: {
		Login,
		SignUp,
	},
	async mounted() {
		const authStore = useAuthStore();

		// Check if the user is authenticated
		if (!authStore.currentUser) {
			try {
				// If the currentUser is not available, fetch it from your backend or local storage
				await authStore.fetchCurrentUser();
			} catch (error) {
				console.error('Failed to fetch the currentUser:', error);
			}
		}

		// If user is authenticated, navigate to the Dashboard view
		if (authStore.currentUser) {
			this.$router.push({ name: 'dashboard', params: { userId: authStore.userId } });
		}
	},
	data() {
		return {
			showLoginForm: true,
		};
	},
};
</script>

<style scoped>
.flip-enter-active {
	animation: flip-in 0.5s ease-in both;
}
.flip-leave-active {
	animation: flip-out 0.5s ease-in both;
}
@keyframes flip-in {
	0% {
		transform: rotateY(90deg);
		opacity: 0;
	}
	100% {
		transform: rotateY(0deg);
		opacity: 1;
	}
}
@keyframes flip-out {
	0% {
		transform: rotateY(0deg);
		opacity: 1;
	}
	100% {
		transform: rotateY(90deg);
		opacity: 0;
	}
}
</style>
