<template>
	<div class="spinner">
		<div class="spinner1"></div>
	</div>
</template>
<style scoped>
.spinner {
	background-image: linear-gradient(#ac1cff 35%, #0d6fed);
	width: 100px;
	height: 100px;
	animation: spinning82341 1.7s linear infinite;
	text-align: center;
	border-radius: 50px;
	filter: blur(1px);
	box-shadow: 0px -5px 20px 0px #ac1cff, 0px 5px 20px 0px #0d6fed;
}

.spinner1 {
	background-color: #212529;
	width: 100px;
	height: 100px;
	border-radius: 50px;
	filter: blur(10px);
}

@keyframes spinning82341 {
	to {
		transform: rotate(360deg);
	}
}
</style>
