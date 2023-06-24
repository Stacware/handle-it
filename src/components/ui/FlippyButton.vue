<template>
	<button class="flippy" :class="{ regular: !closeType && !disabled, close: closeType && !disabled, disabled: disabled }">{{ title }}</button>
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
		disabled: {
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
	background-color: #212529 !important;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	border: none;
	padding: 12px;
	gap: 12px;
	border-radius: 8px;
	cursor: pointer;
}

.flippy::before {
	content: '';
	position: absolute;
	inset: 0;
	left: -2px;
	top: 0px;
	margin: auto;
	width: 124px;
	height: 44px;
	border-radius: 10px;
	z-index: -10;
	pointer-events: none;
	transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}

.flippy.regular::before {
	color: white;
	background: linear-gradient(-45deg, #ac1cff 0%, #0d6fed 100%) !important;
}

.flippy.close::before {
	color: #ed0d0d !important;
	background: linear-gradient(-45deg, #ff4141 0%, #ff8989 100%) !important;
}

.flippy.disabled::before {
	color: #a7a7a7;
	transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
	background: linear-gradient(-45deg, #535252 0%, #5082c3 100%) !important;
}

.flippy::after {
	content: '';
	z-index: -1;
	position: absolute;
	inset: 0;
	transform: translate3d(0, 0, 0) scale(0.95);
	filter: blur(20px);
}

.flippy.regular::after {
	color: white;
	background: linear-gradient(-45deg, #ac1cff 0%, #0d6fed 100%);
}

.flippy.close::after {
	background: linear-gradient(-45deg, #ff4141 0%, #ff8989 100%);
}

.flippy.disabled::after {
	color: #a7a7a7;
	background: linear-gradient(-45deg, #535252 0%, #5082c3 100%);
}

.flippy:hover::after {
	filter: blur(30px);
}

.flippy:hover::before {
	transform: rotate(-180deg);
}

.flippy.disabled:hover::before {
	animation: shake 0.6s;
	transform: none; /* Reset transform */
}

.flippy.disabled:hover {
	background-color: #212529;
	animation: shake 0.6s;
}

.flippy:hover {
	background-color: #212529; /* Added background color on hover */
}

.flippy:active::before {
	scale: 0.7;
}

@keyframes shake {
	0% {
		transform: translate(1px, 1px) rotate(0deg);
	}
	10% {
		transform: translate(-1px, -2px) rotate(-1deg);
	}
	20% {
		transform: translate(-3px, 0px) rotate(1deg);
	}
	30% {
		transform: translate(3px, 2px) rotate(0deg);
	}
	40% {
		transform: translate(1px, -1px) rotate(1deg);
	}
	50% {
		transform: translate(-1px, 2px) rotate(-1deg);
	}
	60% {
		transform: translate(-3px, 1px) rotate(0deg);
	}
	70% {
		transform: translate(3px, 1px) rotate(-1deg);
	}
	80% {
		transform: translate(-1px, -1px) rotate(1deg);
	}
	90% {
		transform: translate(1px, 2px) rotate(0deg);
	}
	100% {
		transform: translate(1px, -2px) rotate(-1deg);
	}
}
</style>
