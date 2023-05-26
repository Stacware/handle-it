import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import MarketingView from '../views/MarketingView.vue'
import EmailView from '../views/EmailView.vue'
import { useAuthStore } from '../stores/auth.js'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView
		},
		{
			path: '/dashboard/:userId',
			name: 'dashboard',
			component: DashboardView,
			meta: { requiresAuth: true } // Add this meta field to indicate that the route requires authentication
		},
		{
			path: '/marketing/:userId',
			name: 'marketing',
			component: MarketingView,
			meta: { requiresAuth: true } // Add this meta field to indicate that the route requires authentication
		},
		{
			path: '/email/:userId',
			name: 'email',
			component: EmailView,
			meta: { requiresAuth: true } // Add this meta field to indicate that the route requires authentication
		}
	]
})

router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore()

	// Check if the user is authenticated
	if (!authStore.currentUser) {
		// If the currentUser is not available, fetch it from your backend or local storage
		try {
			await authStore.fetchCurrentUser()
		} catch (error) {
			console.error('Failed to fetch the currentUser:', error)
		}
	}

	if (to.meta.requiresAuth) {
		// Check if the user is authenticated
		if (authStore.currentUser && authStore.userId === to.params.userId) {
			// User is authenticated and matches the required objectId
			next()
		} else {
			// User is not authenticated or does not match the required objectId
			next('/') // Redirect to the home page or any other suitable route
		}
	} else {
		// Route does not require authentication
		next()
	}
})

export default router

