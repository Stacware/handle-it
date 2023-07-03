<template>
	<div class="modal-container">
		<div v-if="show">
			<div class="card-class">
				<h2 class="mb-5 text-center">{{ title }}</h2>
				<div class="content">
					<slot></slot>
					<div class="footer">
						<slot name="buttons"></slot>
					</div>
				</div>
			</div>
		</div>
		<div v-if="show" class="modal-class"></div>
	</div>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
	},
};
</script>

<style scoped>
.modal-container {
	position: fixed;
	top: 20vh;
	left: 35vw;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 20;
}

.modal-class {
	position: fixed;
	z-index: 20;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
}

.card-class {
	width: 30vw;
	height: 60vh;
	background: #212529;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	overflow: hidden;
	border-radius: 20px;
	z-index: 30;
	padding: 60px;
}

h2 {
	color: white;
	z-index: 1;
}

.content {
	z-index: 40;
	color: white;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.card-class::before {
	content: '';
	top: -470px;
	left: 420px;
	position: absolute;
	width: 25%;
	height: 300%;
	background-image: linear-gradient(360deg, #0d6fed, #ac1cff);
	animation: rotBGimg 5s linear infinite;
	transition: all 0.2s linear;
	border-radius: 20px;
	/* transform: scale(1.2); */
}

@keyframes rotBGimg {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}

.card-class::after {
	content: '';
	position: absolute;
	background: #212529;
	inset: 3px;
	border-radius: 15px;
}
/* .card:hover:before {
  background-image: linear-gradient(180deg, rgb(81, 255, 0), purple);
  animation: rotBGimg 3.5s linear infinite;
} */
</style>
