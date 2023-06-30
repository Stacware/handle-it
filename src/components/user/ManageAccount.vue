<template>
	<div class="mt-5 container">
		<h4 class="text-center">Personal Info</h4>
		<div class="d-flex justify-content-center">
			<div class="form-container">
				<div class="">Hello{{ currentUser.firstName ? ', ' + currentUser.firstName + '!' : '!' }}</div>
				<form class="form" @submit.prevent="updateUserInfo">
					<div class="form-group">
						<label for="email">Email</label>
						<input v-model="userEmail" type="text" id="email" name="email" required="" />
						<small v-if="userEmail !== currentUser.email" class="text-danger">Changing your email will also change your login info!</small>
					</div>
					<div class="form-group">
						<label for="firstName">First name</label>
						<input v-model="userFirstName" type="text" id="firstName" name="firstName" required="" />
					</div>
					<div class="form-group">
						<label for="lastName">Last name</label>
						<input v-model="userLastName" type="text" id="lastName" name="lastName" required="" />
					</div>
					<div class="form-button-flippy mt-3">
						<FlippyButton :disabled="!changesDetected" :title="changesDetected ? 'Save' : 'No Changes'" :class="{ disabled: !changesDetected }" />
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
<script>
import { useAuthStore } from '@/stores/auth.js';
import FlippyButton from '@/components/ui/FlippyButton.vue';

export default {
	components: {
		FlippyButton,
	},
	inject: ['currentUser', 'userId'],
	data() {
		return {
			authStore: useAuthStore(),
			userEmail: this.currentUser.email,
			userFirstName: this.currentUser.firstName,
			userLastName: this.currentUser.lastName,
		};
	},
	computed: {
		changesDetected() {
			return this.userEmail !== this.currentUser.email || this.userFirstName !== this.currentUser.firstName || this.userLastName !== this.currentUser.lastName;
		},
	},
	methods: {
		updateUserInfo() {
			const payload = {
				userId: this.userId,
				email: this.userEmail,
				userName: this.userEmail,
				firstName: this.userFirstName,
				lastName: this.userLastName,
			};
			this.authStore.updateUserInfo(payload);
		},
	},
};
// USE vueuse for signing out user if they havent been to page in 15 minutes
</script>

<style scoped>
.form-button-flippy {
	z-index: 1000;
}

.disabled {
	cursor: not-allowed;
}

.form-container {
	width: 75%;
	background: linear-gradient(#212529, #212529) padding-box, linear-gradient(145deg, transparent 35%, #ac1cff, #0d6fed) border-box;
	border: 2px solid transparent;
	padding: 32px 24px;
	font-size: 16px;
	font-family: inherit;
	color: white;
	display: flex;
	flex-direction: column;
	gap: 20px;
	box-sizing: border-box;
	border-radius: 16px;
}

.form-container .form {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.form-container .form-group {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.form-container .form-group label {
	display: block;
	margin-bottom: 5px;
	color: #868686;
	font-weight: 600;
	font-size: 16px;
}

.form-container .form-group input {
	width: 100%;
	padding: 12px 16px;
	border-radius: 8px;
	color: #fff;
	font-family: inherit;
	background-color: transparent;
	border: 1px solid #414141;
}

.form-container .form-group textarea {
	width: 100%;
	padding: 12px 16px;
	border-radius: 8px;
	resize: none;
	color: #fff;
	height: 96px;
	border: 1px solid #414141;
	background-color: transparent;
	font-family: inherit;
}

.form-container .form-group input::placeholder {
	opacity: 0.5;
}

.form-container .form-group input:focus {
	outline: none;
	border-color: #ac1cff;
}

.form-container .form-group textarea:focus {
	outline: none;
	border-color: #ac1cff;
}

/* .form-container .form-submit-btn {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	align-self: flex-start;
	font-family: inherit;
	color: #717171;
	font-weight: 600;
	width: 40%;
	background: #313131;
	border: 1px solid #414141;
	padding: 12px 16px;
	font-size: inherit;
	gap: 8px;
	margin-top: 8px;
	cursor: pointer;
	border-radius: 6px;
}

.form-container .form-submit-btn:hover {
	background-color: #fff;
	border-color: #fff;
} */
</style>
