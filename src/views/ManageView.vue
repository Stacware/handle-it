<template>
	<div class="mt-5">
		<h1 class="text-center">Account Settings</h1>
		<div class="d-flex justify-content-center align-items-center mt-5" style="height: 75vh">
			<div id="carouselExampleIndicators" class="carousel slide w-100 h-100 container">
				<div class="carousel-inner h-100">
					<div class="carousel-item active h-100">
						<div class="card h-100 shadow-lg">
							<div class="card-body">
								<ManageAccount />
							</div>
						</div>
					</div>
					<div class="carousel-item h-100">
						<div class="card h-100 shadow-lg">
							<div class="card-body">
								<BusinessDetails />
							</div>
						</div>
					</div>
					<div class="carousel-item h-100">
						<div class="card h-100 shadow-lg">
							<div class="card-body">
								<Payments />
							</div>
						</div>
					</div>
				</div>
			</div>
			<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
				<span class="carousel-control-prev-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Previous</span>
			</button>
			<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
				<span class="carousel-control-next-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Next</span>
			</button>
		</div>
	</div>
</template>
<script>
import { useAuthStore } from '@/stores/auth.js';
import Payments from '../components/user/Payments.vue';
import ManageAccount from '@/components/user/ManageAccount.vue';
import BusinessDetails from '@/components/user/BusinessDetails.vue';
export default {
	components: {
		ManageAccount,
		BusinessDetails,
		Payments
	},
	inject: ['currentUser'],
	data() {
		return {
			authStore: useAuthStore(),
		};
	},
};
</script>
<style scoped>
.card {
	box-sizing: border-box; /* Include padding and border in an element's total width and height */
	border: unset;
}

.carousel-item {
	height: calc(100% - 1rem); /* Subtracting 1rem to account for any default margins/paddings */
	width: 100%;
}
</style>
