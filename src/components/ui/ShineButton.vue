<template>
	<button class="shine-button">
		<span></span>
		<span></span>
		<span></span>
		<span></span> {{ title }}
	</button>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			required: true,
		},
	},
};
</script>

<style scoped>
.shine-button {
	position: relative;
	/* padding: 0.3rem 1.1rem; */
	outline: none;
	border: 1px solid #212529;
	background: #212529;
	color: #ac1cff;
	/* text-transform: uppercase; */
	letter-spacing: 2px;
	font-size: 18px;
	overflow: hidden;
	transition: 0.2s;
	border-radius: 10px;
	cursor: pointer;
	/* font-weight: bold; */
}

.shine-button:hover {
	box-shadow: 0 0 10px #ac1cff, 0 0 25px #0d6fed, 0 0 50px #ac1cff;
	transition-delay: 0.6s;
}

.shine-button span {
	position: absolute;
}

.shine-button span:nth-child(1) {
	top: 0;
	left: -100%;
	width: 100%;
	height: 2px;
	background: linear-gradient(90deg, transparent, #ac1cff);
}

.shine-button:hover span:nth-child(1) {
	left: 100%;
	transition: 0.7s;
}

.shine-button span:nth-child(3) {
	bottom: 0;
	right: -100%;
	width: 100%;
	height: 2px;
	background: linear-gradient(90deg, transparent, #0d6fed);
}

.shine-button:hover span:nth-child(3) {
	right: 100%;
	transition: 0.7s;
	transition-delay: 0.35s;
}

.shine-button span:nth-child(2) {
	top: -100%;
	right: 0;
	width: 2px;
	height: 100%;
	background: linear-gradient(180deg, transparent, #ac1cff);
}

.shine-button:hover span:nth-child(2) {
	top: 100%;
	transition: 0.7s;
	transition-delay: 0.17s;
}

.shine-button span:nth-child(4) {
	bottom: -100%;
	left: 0;
	width: 2px;
	height: 100%;
	background: linear-gradient(360deg, transparent, #0d6fed);
}

.shine-button:hover span:nth-child(4) {
	bottom: 100%;
	transition: 0.7s;
	transition-delay: 0.52s;
}

.shine-button:active {
	background: #ac1cff;
	background: linear-gradient(to top right, #ac1cff, #0d6fed);
	color: #bfbfbf;
	box-shadow: 0 0 8px #ac1cff, 0 0 8px #0d6fed, 0 0 8px #ac1cff;
	transition: 0.1s;
}

.shine-button:active span:nth-child(1) span:nth-child(2) span:nth-child(2) span:nth-child(2) {
	transition: none;
	transition-delay: none;
}
</style>
