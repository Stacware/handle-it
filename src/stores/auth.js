import { defineStore } from 'pinia'
import Parse from 'parse/dist/parse.min.js'
export const useAuthStore = defineStore({
	id: 'auth',

	state: () => ({
		signUpError: null,
		logInError: null,
		sessionToken: null,
		currentUser: null,
		userId: null,
		vaar: "Parse/MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU/currentUser"
	}),

	getters: {
		returnSignUpError (state) {
			return state.signUpError
		},
		returnLogInError (state) {
			return state.logInError
		},
		returnCurrentUser (state) {
			return state.currentUser
		},
		returnCurrentUserId (state) {
			return state.userId
		}
	},

	actions: {
		async fetchCurrentUser () {
			const storedUser = localStorage.getItem('currentUser')
			const userId = localStorage.getItem('userId')
			if (storedUser) {
				// If user is found in local storage, parse and set it as the currentUser
				try {
					this.currentUser = JSON.parse(storedUser)
					this.userId = userId
				} catch (error) {
					console.error('Failed to parse the stored user:', error)
				}
			}
		},
		async logIn (email, password) {
			this.logInError = null
			try {
				const user = await Parse.User.logIn(email, password)
				console.log(user)
				this.currentUser = user
				this.userId = user.id
				this.sessionToken = user.get('sessionToken')
				localStorage.setItem('currentUser', JSON.stringify(user))
				localStorage.setItem('userId', user.id)

			} catch (error) {
				this.logInError = error
			}
		},

		async signUp (email, password) {
			this.signUpError = null
			const user = new Parse.User()
			user.set("username", email)
			user.set("password", password)
			user.set("email", email)

			try {
				await user.signUp()
				this.currentUser = user
				this.sessionToken = user.get('sessionToken')
			} catch (error) {
				this.signUpError = error
			}
		},

		logOut () {
			Parse.User.logOut()
			localStorage.removeItem('currentUser')
			localStorage.removeItem("Parse/MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU/currentUser")
			this.currentUser = null
			this.sessionToken = null
			this.userId = null
		}
	}
})
