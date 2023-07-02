import { defineStore } from 'pinia'


export const usePandaStore = defineStore({
	id: 'panda',
	state: () => ({
		currentImageIndex: 0,
	}),
	actions: {
		updateImageIndex(newIndex) {
			this.currentImageIndex = newIndex;
		},
	},
});
