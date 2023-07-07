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
					user.set('websiteURL', websiteUrl)
					user.save()
					// Create a new Parse Object for WebsiteInfo
					const WebsiteInfo = Parse.Object.extend("WebsiteInfo")
					const websiteInfo = new WebsiteInfo()

					// Set the content and user
					websiteInfo.set('results', response.data.Results[0])
					websiteInfo.set('user', user)

					// Save the new WebsiteInfo object
					websiteInfo.save().then((websiteInfo) => {
						console.log('WebsiteInfo saved successfuly')
						self.websiteInfo = response.data.Results[0]
					}).catch((error) => {
						console.error('Failed to save WebsiteInfo:', error)
					})
				}).catch((error) => {
					console.error('Failed to get user:', error)
				})
			}).catch((error) => {
				console.error(error)
			})
		}

	}

})
