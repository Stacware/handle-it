<template>
	<div>
	<img :src="currentImage" alt="Current Image" @mouseover="addHoverClass" @mouseout="removeHoverClass" :class="{ 'jello-horizontal': isHovered }"/>
	</div>
</template>
		
<script>
import panda from'@/assets/img/panda.png';
import happyPanda from'@/assets/img/happy-panda.png';
import sadPanda from'@/assets/img/sad-panda.png';
import madPanda from'@/assets/img/mad-panda.png';
import glassesPanda from'@/assets/img/glasses-panda.png';
import backwardsPanda from'@/assets/img/backwards-panda.png';
import kissyPanda from'@/assets/img/kissy-panda.png';
import worriedPanda from'@/assets/img/worried-panda.png';
export default {
	props:['currentImageIndex'],
	data() {
	return {
		imagePaths: [
			panda,
			happyPanda,
			sadPanda,
			madPanda,
			glassesPanda,
			backwardsPanda,
			kissyPanda,
			worriedPanda
		],
		isHovered: false
	};
	},
	computed: {
		currentImage() {
			return this.imagePaths[this.currentImageIndex];
		},
	},
	methods: {
		changeImage() {
		// Increment the currentImageIndex here to change the image
		this.currentImageIndex = (this.currentImageIndex + 1) % this.imagePaths.length;
		},
		addHoverClass() {
			this.isHovered = true;
		},
		removeHoverClass() {
			this.isHovered = false;
		},
	},
};
</script>

<style scoped>
img {
	height: clamp(60px, 4vw, 400px);
	width: auto;
	transition: ease-in-out 500ms;
}


</style>
