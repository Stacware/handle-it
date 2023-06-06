<template>
	<div class="mt-5">
		<h4 class="text-center">Manage account</h4>
		<div>Hello{{ currentUser.attributes.firstName ? ', ' + currentUser.attributes.firstName + '!' : '!' }}</div>
		{{ currentUser }}
	</div>
</template>
<script>
import { useAuthStore } from '@/stores/auth.js';
export default {
	inject: ['currentUser'],
	data() {
		return {
			authStore: useAuthStore(),
		};
	},
};
// USE vueuse for signing out user if they havent been to page in 15 minutes
</script>
