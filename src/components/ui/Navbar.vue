<template>
	<nav class="navbar navbar-expand-lg bg-body-tertiary">
		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="container-fluid">
			<div class="panda-container">
				<Panda :currentImageIndex="currentImageIndex" />
			</div>
			<span class="navbar-brand mb-0 h1">market panda</span>
			<div class="collapse navbar-collapse" :class="!visible ? 'collapse' : ''" id="navbarNav">
				<ul class="navbar-nav me-auto">
					<li v-if="userId" class="nav-item main-nav align-items-start">
						<router-link @click="visible = !visible" :to="{ name: 'dashboard', params: { userId: userId } }" class="nav-link" :active-class="'text-primary'">
							<!-- <i class="bi bi-clipboard-data-fill me-1"></i>
							<span>Dashboard</span> -->
							<DashboardBtn />
						</router-link>
					</li>
					<li v-if="userId" class="nav-item main-nav align-items-start">
						<router-link @click="visible = !visible" :to="{ name: 'marketing', params: { userId: userId } }" class="nav-link" :active-class="'text-primary'">
							<!-- <i class="bi bi-megaphone-fill me-1"></i>
							<span>Marketing</span> -->
							<MarketingBtn />
						</router-link>
					</li>
					<li v-if="userId" class="nav-item main-nav align-items-start">
						<router-link @click="visible = !visible" :to="{ name: 'email', params: { userId: userId } }" class="nav-link" :active-class="'text-primary'">
							<!-- <i class="bi bi-envelope-at-fill me-1"></i>
							<span>Email</span> -->
							<EmailBtn />
						</router-link>
					</li>
					<li v-if="userId" class="nav-item main-nav align-items-start">
						<router-link @click="visible = !visible" :to="{ name: 'post', params: { userId: userId } }" class="nav-link" :active-class="'text-primary'">
							<!-- <i class="bi bi-postcard-fill"></i>
							<span>Post</span> -->
							<PostBtn />
						</router-link>
					</li>
				</ul>
				<ul class="navbar-nav ms-auto">
					<li v-if="userId" class="nav-item align-self-center me-3" :class="{ hovering: hovering }" @mouseenter="hovering = true" @mouseleave="hovering = false">
						<!-- <div class="nav-link align-self-center"> -->
						<i @click="$emit('help')" class="bi bi-question-circle-fill"></i>
						<!-- </div> -->
					</li>
					<li v-if="userId" @mouseenter="linkHover = 'settings'" @mouseleave="linkHover = null" class="nav-item align-items-center">
						<router-link @click="visible = !visible" :to="{ name: 'manage', params: { userId: userId } }" class="nav-link" :active-class="'text-primary'">
							<!-- <i v-if="linkHover !== 'settings'" class="bi bi-gear-fill me-1"></i>
							<span v-if="linkHover === 'settings'">Account Settings</span> -->
							<AccountBtn />
						</router-link>
					</li>
					<li v-if="userId" class="nav-item align-items-center">
						<div class="nav-link">
							<LogOutBtn @click="logout" />
						</div>
						<!-- <button class="btn btn-danger nav-link" @click="logout">
							<i v-if="linkHover !== 'logout'" class="bi bi-box-arrow-left me-1"></i>
							<span v-if="linkHover === 'logout'">Logout</span>
						</button> -->
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script>
import { usePandaStore } from '@/stores/panda.js';
import { useAuthStore } from '@/stores/auth.js';
import LogOutBtn from '@/components/ui/nav-buttons/LogOut.vue';
import DashboardBtn from '@/components/ui/nav-buttons/DashboardBtn.vue';
import MarketingBtn from '@/components/ui/nav-buttons/MarketingBtn.vue';
import EmailBtn from '@/components/ui/nav-buttons/EmailBtn.vue';
import PostBtn from '@/components/ui/nav-buttons/PostBtn.vue';
import AccountBtn from '@/components/ui/nav-buttons/AccountBtn.vue';
import Panda from '@/components/ui/Panda.vue';
export default {
	name: 'Navbar',
	components: {
		AccountBtn,
		PostBtn,
		EmailBtn,
		MarketingBtn,
		DashboardBtn,
		LogOutBtn,
		Panda,
	},
	emits: ['help'],
	inject: ['plan', 'userId'],
	data() {
		return {
			authStore: useAuthStore(),
			pandaStore: usePandaStore(),
			linkHover: null,
			visible: false,
			hovering: false,
		};
	},
	mounted() {
		this.authStore = useAuthStore();
	},
	methods: {
		closeNavbar() {
			this.$nextTick(() => {
				const navbarToggler = document.querySelector('.navbar-toggler');
				const navbarCollapse = document.querySelector('.navbar-collapse.show');
				if (navbarCollapse && window.getComputedStyle(navbarToggler).display !== 'none') {
					navbarToggler.click();
				}
			});
		},
		async logout() {
			// Call your logout method here
			await this.authStore.logOut();
			// Redirect to home
			this.$router.push({ name: 'home' });
		},
	},
	computed: {
		currentImageIndex() {
			return this.pandaStore.currentImageIndex;
		},
	},
};
</script>

<style scoped>
.navbar {
	z-index: 2;
	position: relative; /* or absolute or fixed or sticky */
}

.nav-item {
	position: relative;
	/* overflow: hidden; */
}

.main-nav > .nav-link {
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: flex-start;
}

.main-nav > .nav-link i {
	margin-right: 5px;
	transition: margin 0.3s ease-in-out;
}

.main-nav > .nav-link span {
	position: absolute;
	left: 12px; /* Starting position off-screen (to the left) */
	color: transparent; /* Hide the text initially */
	transition: transform 0.5s ease-in-out, color 0.3s ease-in-out;
	white-space: nowrap;
}

.main-nav > .nav-item:hover .nav-link span {
	color: initial; /* Reveal the text on hover */
	transform: translateX(20px);
}

.main-nav > .nav-item:hover .nav-link i {
	margin-right: 2px; /* Adjust this value to create enough space for the text */
}

.navbar-nav > .main-nav li {
	transition: transform 0.3s ease-in-out;
}

.navbar-nav > .main-nav li:hover ~ li {
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

.plan {
	height: 56px;
}

.hovering {
	color: #ac1cff;
	cursor: pointer;
}
</style>
