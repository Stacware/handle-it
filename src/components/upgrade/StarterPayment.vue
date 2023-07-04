<template>
	<div class="container">
		<div class="d-flex justify-content-center">
			<div class="form-container">
				<div class="h1">Payment Info - Starter Plan</div>
				<form @submit.prevent="submit">
					<div id="card-element"><!--Stripe.js will place the card Element here--></div>
					<!-- <button type="submit">Subscribe</button> -->
				</form>
				<!-- <img src="../../../public/stripe.png" alt="" srcset="" /> -->
				<FlippyButton @click="submit" class="upgrade-button" :title="'Upgrade me!'" />
			</div>
		</div>
	</div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';
import FlippyButton from '@/components/ui/FlippyButton.vue';

export default {
	components: {
		FlippyButton,
	},
	data() {
		return {
			stripe: null,
			card: null,
			elements: null,
		};
	},
	async mounted() {
		this.stripe = await loadStripe('pk_test_51NPIe1HNcBL4SbOJET7arjnDduQ0sWwYeBRSfm2dSK46gkWrJxbK71F105xkAVMa9Bka26HDcKKb1IZu0JUF6mOF00fMlOzKd1');
		this.elements = this.stripe.elements();
		this.card = this.elements.create('card');
		this.card.mount('#card-element');
	},
	methods: {
		async submit() {
			const { paymentMethod, error } = await this.stripe.createPaymentMethod({
				type: 'card',
				card: this.card,
			});

			if (error) {
				// Inform the user if there was an error
				console.error(error.message);
			} else {
				// Emit the paymentMethod id to the parent component
				this.$emit('paymentMethodCreated', { paymentMethodId: paymentMethod.id, plan: 'Starter' });
			}
		},
	},
};
</script>
<style scoped>
img {
	height: 20vh;
	width: 20vw;
}
.container {
	margin-top: 30vh;
}
.upgrade-button {
	z-index: 1;
	margin-top: 2rem;
}
.card-container {
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
}
.StripeElement {
	background-color: #ffffffc8;
	color: white !important;
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
	box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
	width: 100%;
	height: 40px;
	transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.InputElement {
	color: white !important;
}

.StripeElement--focus {
	outline: none;
	border-color: #ac1cff;
	color: white;
	box-shadow: 0 0 0 0.2rem #ac1cff3c;
}

.form-container {
	width: 75%;
	background: linear-gradient(#212529, #212529) padding-box, linear-gradient(145deg, transparent 35%, #ac1cff, #0d6fed) border-box;
	border: 2px solid transparent;
	border-radius: 16px;
	padding: 32px 24px;
	font-size: 16px;
	font-family: inherit;
	color: white;
	display: flex;
	flex-direction: column;
	gap: 20px;
	box-sizing: border-box;
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

input {
	width: 100%;
	padding: 12px 16px;
	border-radius: 8px;
	color: #fff !important;
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
