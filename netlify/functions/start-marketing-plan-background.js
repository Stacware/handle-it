const { Configuration, OpenAIApi } = require('openai')
const Parse = require('parse/node')

Parse.initialize("MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU", "A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ")
Parse.serverURL = "https://parseapi.back4app.com"

exports.handler = async (event, context) => {
	const Parse = require('parse/node')
	const parseConfig = {
		applicationId: 'MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU',
		apiKey: 'V4j0HjRijESDoPboQohy16nq75kHY3H6RS6Xf1ty',
		serverURL: 'https://parseapi.back4app.com',
	}

	Parse.initialize(parseConfig.applicationId, null, parseConfig.apiKey)

	const { Configuration, OpenAIApi } = require('openai')

	const body = JSON.parse(event.body)
	const payload = body.payload
	const userId = body.userId // Get the userId from the request body

	const User = Parse.Object.extend('User')
	const query = new Parse.Query(User)

	try {
		const user = await query.get(userId) // Get the user object
		console.log(user)
		user.set('taskStatus', 'pending') // Set taskStatus to 'pending'
		await user.save() // Wait for the save operation to complete
		console.log('User saved successfully.')
	} catch (error) {
		console.error('Error: ', error)
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error.toString() })
		}
	} finally {
		const user = await query.get(userId)
		const configuration = new Configuration({
			organization: 'org-5C2c3cHJsvmv3cCc5WWNhZs1',
			apiKey: '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',
		})

		const openai = new OpenAIApi(configuration)
		const response = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [{ role: 'user', content: payload }],
		})

		// Once the task is complete, update the taskStatus and taskResult
		user.set('taskStatus', 'complete')
		user.set('taskResult', response.data.choices)
		await user.save() // Wait for the save operation to complete

		return {
			statusCode: 200,
			body: JSON.stringify({ taskId: userId, marketingPlan: response.data.choices[0].message.content })
		}
	}
}
