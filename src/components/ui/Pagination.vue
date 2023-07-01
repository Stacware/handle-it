<!-- 
Pass in these props:
	perPage: number of items per page in the pagination
	totalItems: the length of the list which is to be paginated
	loading: use the eventsStore loading state

Use this $emit with the current page number:
	paginatedItems: Emit the page number you wish to display, the parent component will need to filter (this component only gives the page number)
-->

<template>
	<div
		v-if="pageNumbers.length > 0"
		class="resources-pages align-self-center"
	>
		<nav aria-label="Page navigation">
			<ul
				class="pagination mb-0"
			>
			<li>
				<button @click="firstPage" class="p-1 me-2 mt-1 btn btn-link" href="">&lt;&lt;&lt;</button>
			</li>
				<li>
					<button
						role="button"
						
						@click="pageDown"
						class="mb-0 btn-link"
					>
					&lt;
				</button>
				</li>
				<template
					v-for="(page, idx) in pageNumbers"
					:key="idx"
				>
					<li
						v-if="page > 0 && page <= totalPages"
						:class="{ 'page-item': true, active: page === currentPage }"
					>
						<button @click="currentPage = page">{{ page }}</button>
					</li>
				</template>
				<li>
					<button
						role="button"
						
						@click="pageUp"
						class="mb-0 btn-link"
					>
						>
				</button>
				</li>
				<li >
					<button @click="lastPage" class="p-1 mt-1 btn btn-link" >>>></button>
				</li>
			</ul>
		</nav>
	</div>
</template>

<script>
export default {
	emits: ["paginatedItems"],
	props: {
		perPage: {
			type: Number,
			default: 5,
		},
		totalItems: {
			type: Number,
			required: true,
		},
	},
	data() {
		return {
			currentPage: 1,
			pageNumbers: [],
		};
	},
	watch: {
		currentPage() {
			this.displayPageCount();
		},
		totalItems() {
			this.currentPage = 1;
			this.displayPageCount();
		},
	},
	created() {
		this.displayPageCount();
	},
	computed: {
		totalPages() {
			return Math.ceil(this.totalItems / this.perPage);
		},
	},
	methods: {
		lastPage (){
			this.currentPage = this.totalPages
		},
		firstPage (){
			this.currentPage = 1
		},
		displayPageCount() {
			this.pageNumbers = [];
			// Calculate the range of page numbers to display, 5 or fewer numbers displayed, i.e. 12345, 23456, 34567, etc.
			let startPage = Math.max(this.currentPage - 2, 1);
			let endPage = Math.min(this.currentPage + 2, this.totalPages);
			if (endPage - startPage < 4) {
				if (startPage === 1) {
					endPage = Math.min(startPage + 4, this.totalPages);
				} else {
					startPage = Math.max(endPage - 4, 1);
				}
			}

			// Display the page numbers in the range
			for (let i = startPage; i <= endPage; i++) {
				this.pageNumbers.push(i);
			}
			this.$emit("paginatedItems", this.currentPage);
		},
		pageUp() {
			if (this.currentPage < this.totalPages) {
				this.currentPage = this.currentPage + 1;
			}
		},
		pageDown() {
			if (this.currentPage > 1) {
				this.currentPage = this.currentPage - 1;
			}
		},
		
	},
};
</script>

<style scoped>
li p {
	height: 75%;
	padding: 0.25rem;
	transition: 300ms ease;
}
li p:hover {
	border-radius: 100%;
	background-color: rgba(var(--bs-light-rgb), 0.9);
}
.pagination .active {
	background-color: rgba(var(--bs-secondary-rgb), 0.08);
	border: none;
	border-radius: 100%;
	width: 2rem;
	height: 80%;
	transition: 300ms ease;
}
.pagination button {
	background-color: transparent;
	border: none;
	border-radius: 100%;
	width: 2rem;
	padding: 0.5rem;
	color: var(--bs-secondary);
	transition: 300ms ease;
}
.pagination button:hover {
	background-color: var(--bs-gray-100);
	box-shadow: none;
}
.pagination button.btn-link {
	border-radius: 0;
}
.pagination button.btn-link:hover {
	background-color: transparent;
}
</style>
