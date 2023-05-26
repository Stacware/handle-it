<template>
	<nav class="navbar navbar-expand-lg bg-body-tertiary">
		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="container-fluid">
			<span class="navbar-brand mb-0 h1">handleIT</span>
			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav me-auto">
					<li v-if="userId" class="nav-item align-items-start me-3">
						<router-link :to="{ name: 'dashboard', params: { userId: userId } }" class="nav-link" :active-class="'text-primary'">
							<i class="bi bi-clipboard-data-fill me-2"></i>
							Dashboard
						</router-link>
					</li>
					<li v-if="userId" class="nav-item align-items-start me-3">
						<router-link :to="{ name: 'marketing', params: { userId: userId } }" class="nav-link" :active-class="'text-primary'">
							<i class="bi bi-megaphone-fill me-2"></i>
							Marketing
						</router-link>
					</li>
					<li v-if="userId" class="nav-item align-items-start">
						<router-link :to="{ name: 'email', params: { userId: userId } }" class="nav-link" :active-class="'text-primary'">
							<i class="bi bi-envelope-at-fill me-2"></i>
							Email
						</router-link>
					</li>
					<li v-if="false" class="nav-item">
						<router-link to="/manage-account" class="nav-link">Manage Account</router-link>
					</li>
				</ul>
				<ul class="navbar-nav ms-auto" v-if="userId">
					<li class="nav-item">
						<button class="btn btn-danger" @click="logout">Logout</button>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script>
import { inject } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
export default {
	name: 'Navbar',
	data() {
		return {
			authStore: useAuthStore(),
		};
	},
	setup() {
		const userId = inject('userId');
		return {
			userId,
		};
	},
	methods: {
		async logout() {
			// Call your logout method here
			await this.authStore.logOut();
			// Redirect to home
			this.$router.push({ name: 'home' });
		},
	},
};
</script>

<style scoped>
.navbar {
	height: 100%;
}

.btn-danger {
	border: unset;
	background: transparent;
}

.btn-danger:hover {
	border: unset;
	background: transparent;
	color: var(--bs-danger);
}
</style>
