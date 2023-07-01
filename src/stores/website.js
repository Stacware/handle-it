import { defineStore } from 'pinia'
import Parse from 'parse/dist/parse.min.js'
import axios from 'axios'
export const useWebsiteStore = defineStore({
	id: 'website',

	state: () => ({
		websiteInfo: null
	}),

	getters: {
		getWebsiteInfo (state) {
			return state.websiteInfo
		}
	},

	actions: {
		fetchWebsiteInfo (websiteUrl, userId) {
			var options = {
				method: 'GET',
				url: 'https://api.builtwith.com/v19/api.json',
				params: {
					KEY: '50bea772-0dd2-48be-b0b0-5872efc28ff4',
					LOOKUP: websiteUrl
				}
			}

			const self = this

			axios.request(options).then((response) => {
				console.log(response.data)

				const User = new Parse.User()
				const query = new Parse.Query(User)
				query.get(userId).then((user) => {
					console.log(user)
					user.set('websiteInfo', response.data.Results[0])
					self.websiteInfo = response.data.Results[0]

					user.save()
				})
			}).catch((error) => {
				console.error(error)
			})
		}
	}

})
