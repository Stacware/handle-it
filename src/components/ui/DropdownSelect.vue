<template>
	<div>
		<select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
			<option selected>{{ title }}</option>
			<option v-for="option in options" :key="option" :value="option">{{ option }}</option>
		</select>
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
};
</script>
