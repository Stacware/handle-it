<template>
	<div class="container py-5">
		<div class="row justify-content-center">
			<div class="col-12 col-md-8 col-lg-6">
				<div class="card shadow-lg">
					<div class="card-body p-5">
						<h3 class="text-center mb-5">Create Your Account</h3>
						<form @submit.prevent="signUp">
							<div class="mb-3 input-group">
								<span class="input-group-text" id="email-addon"><i class="bi bi-envelope"></i></span>
								<input
									type="email"
									class="form-control"
									id="email"
									v-model="email"
									@input="emailTouched = true"
									:class="{ 'is-invalid': !isEmailValid && emailTouched }"
									placeholder="Email Address" />
								<div class="invalid-feedback">Please enter a valid email address.</div>
							</div>
							<div class="mb-3 input-group">
								<span class="input-group-text" id="password-addon"><i class="bi bi-lock"></i></span>
								<input
									type="password"
									class="form-control"
									id="password"
									v-model="password"
									@input="passwordTouched = true"
									:class="{ 'is-invalid': !isPasswordValid && passwordTouched }"
									placeholder="Password" />
								<div class="invalid-feedback">Password should be at least 8 characters.</div>
							</div>
							<div class="mb-3 input-group">
								<span class="input-group-text" id="confirm-password-addon"><i class="bi bi-lock-fill"></i></span>
								<input
									type="password"
									class="form-control"
									id="confirmPassword"
									v-model="confirmPassword"
									@input="confirmPasswordTouched = true"
									:class="{ 'is-invalid': !isConfirmPasswordValid && confirmPasswordTouched }"
									placeholder="Confirm Password" />
								<div class="invalid-feedback">Passwords do not match.</div>
							</div>
							<button type="submit" class="btn btn-primary w-100 mt-4 py-2" :disabled="!isFormValid || loading">
								<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="loading"></span>
								<span v-if="loading"> Creating your account...</span>
								<span v-else>Sign Up</span>
							</button>
							<div class="mt-3">
								<small>Already have an account? <a href="#" @click.prevent="$emit('switch')">Log in!</a></small>
							</div>
							<div v-if="returnSignUpError" class="mt-3">
								<small class="text-danger">Error! {{ returnSignUpError }}</small>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { useAuthStore } from '../../stores/auth.js';
export default {
	data() {
		return {
			email: '',
			password: '',
			confirmPassword: '',
			emailTouched: false,
			passwordTouched: false,
			confirmPasswordTouched: false,
			loading: false,
			authStore: useAuthStore(),
		};
	},
	computed: {
		isEmailValid() {
			// Simple regex for basic email validation
			const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(this.email);
		},

		isPasswordValid() {
			return this.password.length >= 8;
		},

		isConfirmPasswordValid() {
			return this.password === this.confirmPassword;
		},

		isFormValid() {
			return this.isEmailValid && this.isPasswordValid && this.isConfirmPasswordValid;
		},
		returnSignUpError() {
			return this.authStore.returnSignUpError;
		},
	},
	methods: {
		async signUp() {
			if (this.isFormValid) {
				this.loading = true;
				try {
					await this.authStore.signUp(this.email, this.password);
				} finally {
					setTimeout(() => {
						this.loading = false;
						this.email = '';
						this.password = '';
						this.confirmPassword = '';
						this.emailTouched = false;
						this.passwordTouched = false;
						this.confirmPasswordTouched = false;
					}, 1800);
				}
			}
		},
	},
};
</script>
