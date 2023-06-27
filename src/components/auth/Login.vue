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
									@focus="onUsernameFocus"
									@blur="onBlur"
									:class="{ 'is-invalid': !isEmailValid && emailTouched, focused: usernameFocused }"
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
									@focus="onPasswordFocus"
									@blur="onBlur"
									:class="{ 'is-invalid': !isPasswordValid && passwordTouched, focused: passwordFocused }"
									placeholder="Password" />
								<div class="invalid-feedback">Password should be at least 8 characters.</div>
							</div>
							<!-- <button type="submit" class="btn btn-primary w-100 mt-4 py-2" :disabled="!isFormValid || loading">
								<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="loading"></span>
								<span v-if="loading"> Logging in...</span>
								<span v-else>Log In</span>
							</button> -->

							<div class="mt-3">
								<small>Don't have an account? No problem, <a href="#" @click.prevent="$emit('switch')">create one!</a></small>
							</div>
							<div v-if="returnLogInError" class="mt-3">
								<small class="text-danger">Error! {{ returnLogInError }}</small>
							</div>
							<FlippyButton :disabled="!isFormValid" :title="loading ? 'Logging in...' : !isFormValid ? 'Nope' : 'Login'" class="mt-5" :class="{ disabled: !isFormValid }" />
						</form>
						<div class="ear-l"></div>
						<div class="ear-r"></div>
						<div class="panda-face">
							<div class="blush-l"></div>
							<div class="blush-r"></div>
							<div class="eye-l">
								<div class="eyeball-l" :class="{ focused: usernameFocused }"></div>
							</div>
							<div class="eye-r">
								<div class="eyeball-r" :class="{ focused: usernameFocused }"></div>
							</div>
							<div class="nose"></div>
							<div class="mouth"></div>
						</div>
						<div class="hand-l" :class="{ focused: passwordFocused }"></div>
						<div class="hand-r" :class="{ focused: passwordFocused }"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { useAuthStore } from '../../stores/auth.js';
import FlippyButton from '@/components/ui/FlippyButton.vue';

export default {
	components: {
		FlippyButton,
	},
	data() {
		return {
			email: '',
			password: '',
			emailTouched: false,
			passwordTouched: false,
			usernameFocused: false,
			passwordFocused: false,
			loading: false,
			authStore: useAuthStore(),
		};
	},
	watch: {
		userId(val) {
			if (val) {
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
		returnLogInError() {
			return this.authStore.returnLogInError;
		},
	},
	methods: {
		onUsernameFocus() {
			this.usernameFocused = true;
			this.passwordFocused = false;
		},
		onPasswordFocus() {
			this.usernameFocused = false;
			this.passwordFocused = true;
		},
		onBlur() {
			this.usernameFocused = false;
			this.passwordFocused = false;
		},
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

<style scoped>
.card {
	z-index: 1;
}
.eyeball-l.focused {
	left: 0.75em;
	top: 1.12em;
}
.eyeball-r.focused {
	right: 0.75em;
	top: 1.12em;
}
.hand-l.focused {
	height: 6.56em;
	top: -5.625rem;
	left: 15.625rem;
	transform: rotate(-155deg);
}
.hand-r.focused {
	height: 6.56em;
	top: -5.625rem;
	right: 15.625rem;
	transform: rotate(155deg);
}
.panda-face {
	height: 7.5em;
	width: 8.4em;
	background-color: #ffffff;
	border: 0.18em solid #052b64;
	border-radius: 7.5em 7.5em 5.62em 5.62em;
	position: absolute;
	top: -7.5rem;
	margin: auto;
	left: 0;
	right: 0;
}
.ear-l,
.ear-r {
	background-color: #0d6efd;
	height: 2.5em;
	width: 2.81em;
	border: 0.18em solid #052b64;
	border-radius: 2.5em 2.5em 0 0;
	top: -7.813rem;
	position: absolute;
}
.ear-l {
	transform: rotate(-38deg);
	left: 14.375rem;
}
.ear-r {
	transform: rotate(38deg);
	right: 14.375rem;
}
.blush-l,
.blush-r {
	background-color: #ff8bb1;
	height: 1em;
	width: 1.37em;
	border-radius: 50%;
	position: absolute;
	top: 4em;
}
.blush-l {
	transform: rotate(25deg);
	left: 1em;
}
.blush-r {
	transform: rotate(-25deg);
	right: 1em;
}
.eye-l,
.eye-r {
	background-color: #052b64;
	height: 2.18em;
	width: 2em;
	border-radius: 2em;
	position: absolute;
	top: 2.18em;
}
.eye-l {
	left: 1.37em;
	transform: rotate(-20deg);
}
.eye-r {
	right: 1.37em;
	transform: rotate(20deg);
}
.eyeball-l,
.eyeball-r {
	height: 0.6em;
	width: 0.6em;
	background-color: #ffffff;
	border-radius: 50%;
	position: absolute;
	left: 0.6em;
	top: 0.6em;
	transition: 1s all;
}
.eyeball-l {
	transform: rotate(20deg);
}
.eyeball-r {
	transform: rotate(-20deg);
}
.nose {
	height: 1em;
	width: 1em;
	background-color: #052b64;
	position: absolute;
	top: 4.37em;
	margin: auto;
	left: 0;
	right: 0;
	border-radius: 1.2em 0 0 0.25em;
	transform: rotate(45deg);
}
.nose:before {
	content: '';
	position: absolute;
	background-color: #052b64;
	height: 0.6em;
	width: 0.1em;
	transform: rotate(-45deg);
	top: 0.75em;
	left: 1em;
}
.mouth,
.mouth:before {
	height: 0.75em;
	width: 0.93em;
	background-color: transparent;
	position: absolute;
	border-radius: 50%;
	box-shadow: 0 0.18em #052b64;
}
.mouth {
	top: 5.31em;
	left: 3.12em;
}
.mouth:before {
	content: '';
	position: absolute;
	left: 0.87em;
}
.hand-l,
.hand-r {
	background-color: #0d6efd;
	height: 2.81em;
	width: 2.5em;
	border: 0.18em solid #052b64;
	border-radius: 0.6em 0.6em 2.18em 2.18em;
	transition: 1s all;
	position: absolute;
	top: -5px;
}
.hand-l {
	left: 7.5em;
}
.hand-r {
	right: 7.5em;
}

@media screen and (max-width: 500px) {
	.container {
		font-size: 14px;
	}
}

.disabled {
	cursor: not-allowed;
}
</style>
