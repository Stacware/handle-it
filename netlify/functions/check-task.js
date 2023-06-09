const Parse = require('parse/node')

Parse.initialize("MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU", "A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ")
Parse.serverURL = "https://parseapi.back4app.com"

exports.handler = async (event, context) => {
	console.log(event)
	const Parse = require('parse/node')
	Parse.initialize("MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU", "A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ")
	Parse.serverURL = "https://parseapi.back4app.com"

	const userId = event.pathParameters.userId // Get the userId from path parameters
	const User = Parse.Object.extend('User')
	const query = new Parse.Query(User)

	try {
		const user = await query.get(userId) // Get the user object
		const taskStatus = user.get('taskStatus')
		const taskResult = user.get('taskResult')

		// Respond based on the taskStatus
		if (taskStatus === 'complete') {
			// Clear out taskStatus and taskResult after retrieving them
			user.set('taskStatus', '')
			user.set('taskResult', '')
			await user.save()

			return {
				statusCode: 200,
				body: JSON.stringify({ status: 'complete', result: taskResult })
			}
		} else if (taskStatus === 'error') {
			return {
				statusCode: 500,
				body: JSON.stringify({ status: 'error', error: 'An error occurred' })
			}
		} else {
			return {
				statusCode: 200,
				body: JSON.stringify({ status: 'pending' })
			}
		}
	} catch (error) {
		console.error(error)
		return {
			statusCode: 500,
			body: JSON.stringify({ status: 'error', error: 'An error occurred' })
		}
	}
}


