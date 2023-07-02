<template>
	<div class="upcard" :class="[lgScreen ? 'lg-container' : 'reg-container']">
		<span>
			<div class="label">{{ plans.Name }}</div>
		</span>
		<div class="txt">
			<div class="text-center mb-5">
				<h3 v-if="plan.Name !== plans.Name" class="price">{{ plans.Name === 'Free' ? 'Free 99' : '$' + plans.price }}</h3>
				<h3 v-else>Current Plan</h3>
			</div>
			<ul class="list-group list-group-flush p-4">
				<li class="list-group-item" v-for="desc in plans.description" :key="desc">{{ desc }}</li>
			</ul>
			<!-- <div class="icons text-center">
				<i v-if="icon === 'Starter'" class="bi bi-file-play-fill h3"></i>
				<i v-if="icon === 'Business'" class="bi bi-buildings-fill h3"></i>
				<i v-if="icon === 'Free'" class="bi bi-piggy-bank-fill h3"></i>
			</div> -->
		</div>
		<div class="shadow"></div>
	</div>
</template>

<script>
export default {
	props: {
		plans: {
			type: Object,
			required: true,
		},
	},
	inject: ['plan', 'lgScreen'],
};
</script>

<style scoped>
.upcard {
	position: relative;
	border: 4px solid rgba(255, 255, 255, 0.3);
	border-radius: 0.8em;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: 0.5s;
	top: 0%;
	left: 0%;
	/* transform: translate(-50%, -50%); */
}

.upcard.reg-container {
	width: 80%;
	height: 26rem;
}

.upcard.lg-container {
	width: 25rem;
	height: 26rem;
}

.upcard:hover {
	scale: 1.05;
	rotate: 3deg;
}

.upcard::after {
	content: '';
	width: 93%;
	height: 95%;
	position: absolute;
	border-radius: 0.7em;
	background-color: rgba(255, 255, 255, 0.1);
	z-index: 0;
}

.shadow {
	width: 100%;
	height: 100%;
	background: linear-gradient(315deg, #ac1cff, #0d6fed);
	z-index: -1;
	filter: blur(25px);
}

.txt {
	position: absolute;
	color: #fff;
}

.upcard:hover .shadow {
	animation: rotate 3s linear infinite;
}

.upcard span {
	position: absolute;
	overflow: hidden;
	width: 150px;
	height: 150px;
	top: -10px;
	left: -10px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.upcard span .label {
	position: absolute;
	width: 150%;
	height: 40px;
	background-image: linear-gradient(45deg, #d89cfb 0%, #861cff 51%, #6cabff 100%);
	transform: rotate(-45deg) translateY(-20px);
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-weight: 600;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	box-shadow: 0 5px 10px rgba(0, 0, 0, 0.23);
}

.list-group-item {
	background: transparent !important;
	color: white;
}

@keyframes rotate {
	0% {
		rotate: 0deg;
		background: linear-gradient(315deg, #ac1cff, #0d6fed);
	}

	50% {
		rotate: 180deg;
		background: linear-gradient(45deg, #0d6fed, #ac1cff);
	}

	100% {
		rotate: 360deg;
		background: linear-gradient(315deg, #ac1cff, #0d6fed);
	}
}
</style>
