<template>
	<div class="container">
		<h4 class="text-center">Business Details</h4>
		<div class="d-flex justify-content-center">
			<div class="form-container">
				<div>{{ currentUser.companyName }}</div>
				<form class="form" @submit.prevent="updateBusinessDetails">
					<div class="form-group">
						<label for="companyName">Company Name</label>
						<input v-model="companyName" type="text" id="companyName" name="companyName" />
						<small v-if="companyName !== currentUser.companyName" class="text-danger">Hmmm second thoughts?? You sure about that?</small>
					</div>
					<div class="form-group">
						<label for="industry">Industry</label>
						<input v-model="industry" type="text" id="industry" name="industry" required="" />
					</div>
					<div class="form-group">
						<label for="subSector">Sub Sector</label>
						<input v-model="subSector" type="text" id="subSector" name="subSector" required="" />
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
			companyName: this.currentUser.companyName,
			industry: this.currentUser.industry,
			subSector: this.currentUser.subSector,
		};
	},
	computed: {
		changesDetected() {
			return this.companyName !== this.currentUser.companyName || this.industry !== this.currentUser.industry || this.subSector !== this.currentUser.subSector;
		},
	},
	methods: {
		updateBusinessDetails() {
			const payload = {
				userId: this.userId,
				companyName: this.companyName,
				industry: this.industry,
				subSector: this.subSector,
			};
			this.authStore.updateBusinessDetails(payload);
		},
	},
};
// USE vueuse for signing out user if they havent been to page in 15 minutes
</script>

<style scoped>
.container {
	margin-top: 1vh;
}
.form-button-flippy {
	z-index: 1000;
}

.disabled {
	cursor: not-allowed;
}

.form-container {
	width: 75%;
	background: linear-gradient(#212529, #212529) padding-box, linear-gradient(240deg, transparent 35%, #0d6fed, #ac1cff) border-box;
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
	transition: ease-in-out 250ms;
}
.form-container:hover {
	transform: scale(1.01);
	box-shadow: rgba(183, 117, 218, 0.25) 0px 50px 100px -20px, rgba(103, 17, 223, 0.3) 0px 30px 60px -30px, rgba(26, 118, 209, 0.204) 0px -2px 6px 0px inset;
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
</style>
