<template>
	<div class="flippy-card">
		<h5 class="heading text-center">{{ title }}</h5>
		<h1 class="text-center my-auto">{{ count }}/{{ total }}</h1>
	</div>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			required: true,
		},
		count: {
			type: Number,
			required: true,
		},
		total: {
			type: Number,
			required: true,
		},
	},
};
</script>

<style scoped>
.flippy-card {
	position: relative;
	width: 290px;
	height: 290px;
	background-color: #212529;
	display: flex;
	flex-direction: column;
	padding: 12px;
	gap: 12px;
	border-radius: 8px;
	cursor: pointer;
}

.flippy-card::before {
	content: '';
	position: absolute;
	inset: 0;
	left: -5px;
	margin: auto;
	width: 300px;
	height: 300px;
	border-radius: 10px;
	background: linear-gradient(-45deg, #ac1cff 0%, #0d6fed 100%);
	z-index: -10;
	pointer-events: none;
	transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.flippy-card::after {
	content: '';
	z-index: -1;
	position: absolute;
	inset: 0;
	background: linear-gradient(-45deg, #ac1cff 0%, #0d6fed 100%);
	transform: translate3d(0, 0, 0) scale(0.95);
	filter: blur(20px);
}

.heading {
	color: white !important;
}

.flippy-card h1:last-child {
	color: #ac1cff;
	font-weight: 600;
}

.flippy-card:hover::after {
	filter: blur(30px);
}

.flippy-card:hover::before {
	transform: rotate(-90deg) scaleX(1.1) scaleY(0.77);
}
</style>
