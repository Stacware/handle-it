<template>
	<button class="flippy" :class="{ regular: !closeType, close: closeType }">{{ title }}</button>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			required: true,
		},
		closeType: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style scoped>
.flippy {
	position: relative;
	width: 120px;
	height: 40px;
	background-color: #212529;
	align-items: center;
	color: white;
	flex-direction: column;
	justify-content: center;
	border: none;
	padding: 12px;
	gap: 12px;
	border-radius: 8px;
	cursor: pointer;
}

.flippy.regular::before {
	content: '';
	position: absolute;
	inset: 0;
	left: -4px;
	top: 0px;
	margin: auto;
	width: 128px;
	height: 48px;
	border-radius: 10px;
	background: linear-gradient(-45deg, #ac1cff 0%, #0d6fed 100%) !important;
	z-index: -10;
	pointer-events: none;
	transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}

.flippy.regular::after {
	content: '';
	z-index: -1;
	position: absolute;
	inset: 0;
	background: linear-gradient(-45deg, #ac1cff 0%, #0d6fed 100%);
	transform: translate3d(0, 0, 0) scale(0.95);
	filter: blur(20px);
}

.flippy.close::before {
	content: '';
	position: absolute;
	inset: 0;
	left: -4px;
	top: 0px;
	margin: auto;
	width: 128px;
	height: 48px;
	border-radius: 10px;
	background: linear-gradient(-45deg, #ed0d0d 0%, #0d6fed 100%) !important;
	z-index: -10;
	pointer-events: none;
	transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}

.flippy.close::after {
	content: '';
	z-index: -1;
	position: absolute;
	inset: 0;
	background: linear-gradient(-45deg, #ed0d0d 0%, #0d6fed 100%);
	transform: translate3d(0, 0, 0) scale(0.95);
	filter: blur(20px);
}

.flippy:hover::after {
	filter: blur(30px);
}

.flippy:hover::before {
	transform: rotate(-180deg);
}

.flippy:active::before {
	scale: 0.7;
}
</style>
