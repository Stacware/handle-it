<template>
	<div class="card-container">
		<div class="card">
			<div class="front-content">
				<div class="text-center">
					<h1>{{ title }}</h1>
					<p>{{ value }}</p>
				</div>
			</div>
			<div class="content">
				<p class="heading">{{ value }}</p>
				<p>
					{{ description }}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: ['title', 'value', 'description'],
};
</script>

<style scoped>
.card-container {
	width: 300px;
	height: 300px;
	position: relative;
	border-radius: 10px;
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
	overflow: hidden;
}

.card {
	width: 100%;
	height: 100%;
	border-radius: inherit;
}

.card .front-content {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.card .front-content p {
	font-size: 32px;
	font-weight: 700;
	opacity: 1;
	background: linear-gradient(-45deg, #ac1cff 0%, #0d6fed 100%);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.card .content {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	gap: 10px;
	background: linear-gradient(-45deg, #ac1cff 0%, #0d6fed 100%);
	color: #e8e8e8;
	padding: 20px;
	line-height: 1.5;
	border-radius: 5px;
	pointer-events: none;
	transform: translateY(96%);
	transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.card .content .heading {
	font-size: 32px;
	font-weight: 700;
}

.card:hover .content {
	transform: translateY(0);
}

.card:hover .front-content {
	transform: translateY(-30%);
}

.card:hover .front-content p {
	opacity: 0;
}
</style>
