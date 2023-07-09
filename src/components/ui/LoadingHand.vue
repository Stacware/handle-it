<template>
	<div class="hand-container justify-content-center align-items-center" :class="loadStatus ? 'd-flex' : 'd-none'">
		<div class="hand w-50 ">
			<div class="d-flex justify-content-center w-100">
				<div class="🤚">
				<div class="👉"></div>
				<div class="👉"></div>
				<div class="👉"></div>
				<div class="👉"></div>
				<div class="🌴"></div>
				<div class="👍"></div>
				</div>
			</div>
			<div class="mt-5 pb-5">
				<transition name="slide-fade" mode="out-in">
				<span class="load-status h4" :key="loadingMessage">{{ loadingMessage }}...</span>
				</transition>
			</div>
			<div class="d-flex justify-content-center align-items-end">
				<Panda :currentImageIndex="currentImageIndex" @mouseover="random" @mouseleave="random"/>
				<span class="w-25">YO!</span>
			</div>
		</div>
	</div>
</template>

<script>
import { usePandaStore } from '@/stores/panda.js';
import Panda from './Panda.vue'
import { loaderMessages } from '@/business/config.js'
export default {
	props: ['loadStatus', 'loaderContent'],
	components: {
		Panda
	},
	data() {
		return {
			pandaStore : usePandaStore(),
			loadingMessages: '',
			loadingMessageIndex: 0,
			};
	},
	created() {
		if (this.loaderContent === 0) {
				this.loadingMessages = loaderMessages.postLoaderMessages
				console.log(this.loadingMessages)
			}else if(this.loaderContent === 1){
				this.loadingMessages = loaderMessages.emailLoaderMessages
			}else{
				this.loadingMessages = loaderMessages.marketLoaderMessages
			}
	},
	computed: {
		loadingMessage() {
			if (this.loadStatus === true) {
				this.pandaStore.updateImageIndex(4);

				if (this.loadingMessages.length > 0) {
				return this.loadingMessages[this.loadingMessageIndex];
				} else {
				return 'Loading...'; // Default loading message if the array is empty
				}
			} else if (this.loadStatus === false) {
				return 'Viola!';
			} else {
				this.stopLoading();
			}
		},
		currentImageIndex() {
			return this.pandaStore.currentImageIndex;
		},
	},
	mounted() {
		if (this.loadStatus === true) {
		setInterval(() => {
			this.loadingMessageIndex =
			(this.loadingMessageIndex + 1) % this.loadingMessages.length;
		}, 2000); // Change the duration between rotations as desired
		}
	},
	methods: {
		stopLoading() {
			this.pandaStore.updateImageIndex(1)
			this.$emit('stop-loading');
		},
		random() {
			const min = 0;
			const max = 7;
			const num = Math.floor(Math.random() * (max - min + 1)) + min;
			this.pandaStore.updateImageIndex(num);
		}


	}
};
</script>

<style scoped>
.hand-container {
	position: fixed;
	z-index: 5000;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.656);
}
.hand {
	width: 75%;
	background: linear-gradient(#2d2d34, #6900fc36) padding-box, linear-gradient(15deg, transparent 35%, #0d6fed , #ac1cff) border-box;
	border: 2px solid transparent;
	padding: 32px 24px;
	font-size: 16px;
	font-family: inherit;
	color: white;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	border-radius: 16px;
	transition: ease-in-out 250ms;
}
.hand:hover {
	transform: scale(1.01);
	box-shadow: rgba(183, 117, 218, 0.25) 0px 50px 100px -20px, rgba(103, 17, 223, 0.3) 0px 30px 60px -30px, rgba(26, 118, 209, 0.204) 0px -2px 6px 0px inset;

}
.🤚 {
	--skin-color: #e4c560;
	--tap-speed: 0.6s;
	--tap-stagger: 0.1s;
	position: relative;
	width: 80px;
	height: 60px;
	margin-left: 80px;
}

.🤚:before {
	content: '';
	display: block;
	width: 180%;
	height: 75%;
	position: absolute;
	top: 70%;
	right: 20%;
	background-color: black;
	border-radius: 40px 10px;
	filter: blur(10px);
	opacity: 0.3;
}

.🌴 {
	display: block;
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	background-color: var(--skin-color);
	border-radius: 10px 40px;
}

.👍 {
	position: absolute;
	width: 120%;
	height: 38px;
	background-color: var(--skin-color);
	bottom: -18%;
	right: 1%;
	transform-origin: calc(100% - 20px) 20px;
	transform: rotate(-20deg);
	border-radius: 30px 20px 20px 10px;
	border-bottom: 2px solid rgba(0, 0, 0, 0.1);
	border-left: 2px solid rgba(0, 0, 0, 0.1);
}

.👍:after {
	width: 20%;
	height: 60%;
	content: '';
	background-color: rgba(255, 255, 255, 0.3);
	position: absolute;
	bottom: -8%;
	left: 5px;
	border-radius: 60% 10% 10% 30%;
	border-right: 2px solid rgba(0, 0, 0, 0.05);
}

.👉 {
	position: absolute;
	width: 80%;
	height: 35px;
	background-color: var(--skin-color);
	bottom: 32%;
	right: 64%;
	transform-origin: 100% 20px;
	animation-duration: calc(var(--tap-speed) * 2);
	animation-timing-function: ease-in-out;
	animation-iteration-count: infinite;
	transform: rotate(10deg);
}

.👉:before {
	content: '';
	position: absolute;
	width: 140%;
	height: 30px;
	background-color: var(--skin-color);
	bottom: 8%;
	right: 65%;
	transform-origin: calc(100% - 20px) 20px;
	transform: rotate(-60deg);
	border-radius: 20px;
}

.👉:nth-child(1) {
	animation-delay: 0;
	filter: brightness(70%);
	animation-name: tap-upper-1;
}

.👉:nth-child(2) {
	animation-delay: var(--tap-stagger);
	filter: brightness(80%);
	animation-name: tap-upper-2;
}

.👉:nth-child(3) {
	animation-delay: calc(var(--tap-stagger) * 2);
	filter: brightness(90%);
	animation-name: tap-upper-3;
}

.👉:nth-child(4) {
	animation-delay: calc(var(--tap-stagger) * 3);
	filter: brightness(100%);
	animation-name: tap-upper-4;
}

@keyframes tap-upper-1 {
	0%,
	50%,
	100% {
		transform: rotate(10deg) scale(0.4);
	}

	40% {
		transform: rotate(50deg) scale(0.4);
	}
}

@keyframes tap-upper-2 {
	0%,
	50%,
	100% {
		transform: rotate(10deg) scale(0.6);
	}

	40% {
		transform: rotate(50deg) scale(0.6);
	}
}

@keyframes tap-upper-3 {
	0%,
	50%,
	100% {
		transform: rotate(10deg) scale(0.8);
	}

	40% {
		transform: rotate(50deg) scale(0.8);
	}
}

@keyframes tap-upper-4 {
	0%,
	50%,
	100% {
		transform: rotate(10deg) scale(1);
	}

	40% {
		transform: rotate(50deg) scale(1);
	}
}

</style>
