<template>
	<div class="form-floating">
		<select class="form-select mb-3" :class="{ 'is-invalid': select === null }" id="floatingSelect" aria-label="select" v-model="select">
			<option selected :value="null">Select an option</option>
			<option v-for="option in options" :key="option" :value="option">{{ option }}</option>
		</select>
		<label for="floatingSelect">{{ title }}</label>
	</div>
</template>

<script>
export default {
	props: {
		options: {
			type: Array,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
	},
	emits: ['model-change'],
	watch: {
		select(oldVal, newVal) {
			if (oldVal !== newVal) {
				this.$emit('model-change', this.select);
			}
		},
	},
	data() {
		return {
			select: null,
		};
	},
};
</script>
