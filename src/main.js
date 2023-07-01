import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import '../public/fonts.css'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

import BaseModal from '@/components/ui/BaseModal.vue'
import DropdownSelect from '@/components/ui/DropdownSelect.vue'

import Parse from 'parse/dist/parse.min.js'

Parse.initialize("MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU", "A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ")
Parse.serverURL = "https://parseapi.back4app.com"

const app = createApp(App)

app.component('base-modal', BaseModal)
app.component('dropdown-select', DropdownSelect)
app.component('QuillEditor', QuillEditor)
app.use(createPinia())
app.use(router)
app.mixin({
	methods: {
		formatMessage (message) {
			if (!message) return ''
			message = message.toString()
			return message.replace(/\n/g, '<br/>')
		},
	},
})
app.mount('#app')
