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
							<i class="bi bi-clipboard-data-fill me-1"></i>
							<span>Dashboard</span>
						</router-link>
					</li>
					<li v-if="userId" class="nav-item align-items-start me-3">
						<router-link :to="{ name: 'marketing', params: { userId: userId } }" class="nav-link" :active-class="'text-primary'">
							<i class="bi bi-megaphone-fill me-1"></i>
							<span>Marketing</span>
						</router-link>
					</li>
					<li v-if="userId" class="nav-item align-items-start me-3">
						<router-link :to="{ name: 'email', params: { userId: userId } }" class="nav-link" :active-class="'text-primary'">
							<i class="bi bi-envelope-at-fill me-1"></i>
							<span>Email</span>
						</router-link>
					</li>
					<li v-if="userId" class="nav-item align-items-start me-3">
						<router-link :to="{ name: 'manage', params: { userId: userId } }" class="nav-link" :active-class="'text-primary'">
							<i class="bi bi-gear-fill me-1"></i>
							<span>Account Settings</span>
						</router-link>
					</li>
				</ul>
				<ul class="navbar-nav ms-auto" v-if="userId">
					<li class="nav-item" @mouseenter="linkHover = 'logout'" @mouseleave="linkHover = null">
						<button class="btn btn-danger d-flex" @click="logout">
							<i v-if="linkHover !== 'logout'" class="bi bi-box-arrow-left me-1 align-self-bottom"></i>
							<span v-if="linkHover === 'logout'">Logout</span>
						</button>
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
			linkHover: null,
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
.nav-item {
	position: relative;
	/* overflow: hidden; */
}

.nav-link {
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: flex-start;
}

.nav-link i {
	margin-right: 5px;
	transition: margin 0.3s ease-in-out;
}

.nav-link span {
	position: absolute;
	left: 12px; /* Starting position off-screen (to the left) */
	color: transparent; /* Hide the text initially */
	transition: transform 0.5s ease-in-out, color 0.3s ease-in-out;
	white-space: nowrap;
}

.nav-item:hover .nav-link span {
	color: initial; /* Reveal the text on hover */
	transform: translateX(20px);
}

.nav-item:hover .nav-link i {
	margin-right: 2px; /* Adjust this value to create enough space for the text */
}

.navbar-nav li {
	transition: transform 0.3s ease-in-out;
}

.navbar-nav li:hover ~ li {
	transform: translateX(70px); /* Adjust this value based on the width of your text */
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
