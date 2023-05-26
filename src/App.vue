<template>
	<div>
		<Navbar />
		<router-view></router-view>
	</div>
</template>
<script>
import { computed } from 'vue';
import Navbar from '@/components/ui/Navbar.vue';
import { useAuthStore } from '@/stores/auth.js';

export default {
	components: {
		Navbar,
	},
	data() {
		return {
			authStore: useAuthStore(),
		};
	},
	provide() {
		return {
			userId: computed(() => this.userId),
		};
	},
	computed: {
		userId() {
			return this.authStore.returnCurrentUserId;
		},
	},
};
</script>

<style scoped></style>
