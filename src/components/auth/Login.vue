<template>
	<div class="container py-5">
		<div class="row justify-content-center">
			<div class="col-12 col-md-8 col-lg-6">
				<div class="card shadow-lg">
					<div class="card-body p-5">
						<h3 class="text-center mb-5">Welcome Back!</h3>
						<form @submit.prevent="login">
							<div class="mb-3 input-group">
								<span class="input-group-text" id="login-email-addon"><i class="bi bi-envelope"></i></span>
								<input
									type="email"
									class="form-control"
									id="loginEmail"
									v-model="email"
									@input="emailTouched = true"
									:class="{ 'is-invalid': !isEmailValid && emailTouched }"
									placeholder="Email Address" />
								<div class="invalid-feedback">Please enter a valid email address.</div>
							</div>
							<div class="mb-3 input-group">
								<span class="input-group-text" id="login-password-addon"><i class="bi bi-lock"></i></span>
								<input
									type="password"
									class="form-control"
									id="loginPassword"
									v-model="password"
									@input="passwordTouched = true"
									:class="{ 'is-invalid': !isPasswordValid && passwordTouched }"
									placeholder="Password" />
								<div class="invalid-feedback">Password should be at least 8 characters.</div>
							</div>
							<button type="submit" class="btn btn-primary w-100 mt-4 py-2" :disabled="!isFormValid || loading">
								<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="loading"></span>
								<span v-if="loading"> Logging in...</span>
								<span v-else>Log In</span>
							</button>
							<div class="mt-3">
								<small>Don't have an account? No problem, <a href="#" @click.prevent="$emit('switch')">create one!</a></small>
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
			emailTouched: false,
			passwordTouched: false,
			loading: false,
			authStore: useAuthStore(),
		};
	},
	watch: {
		userId(val) {
			if (val) {
				console.log(val);
				this.$router.push({ name: 'dashboard', params: { userId: this.userId } });
			}
		},
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

		isFormValid() {
			return this.isEmailValid && this.isPasswordValid;
		},
		userId() {
			return this.authStore.returnCurrentUserId;
		},
	},
	methods: {
		async login() {
			if (this.isFormValid) {
				this.loading = true;
				try {
					await this.authStore.logIn(this.email, this.password);
				} finally {
					this.loading = false;
				}
			}
		},
	},
};
</script>
