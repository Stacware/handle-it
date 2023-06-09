
exports.handler = async (event, context) => {
	const { Configuration, OpenAIApi } = require('openai')
	// const Parse = require('parse/node')

	// Parse.initialize('MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU', 'A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ')
	// Parse.serverURL = 'https://parseapi.back4app.com/'
	const body = JSON.parse(event.body)
	const payload = body.payload
	// const userId = body.userId

	try {
		const configuration = new Configuration({
			apiKey: process.env.OPENAI_API_KEY,
		})

		const openai = new OpenAIApi(configuration)
		const response = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [{ role: 'user', content: payload }],
		})

		if (response) {
			// const User = Parse.Object.extend("User")
			// const query = new Parse.Query(User)
			// const user = await query.get(userId)  // Get the user based on objectId

			// user.set('taskStatus', 'complete')
			// user.set('marketingPlan', response.data.choices[0].message.content)
			// await user.save()

			return {
				statusCode: 200,
				body: JSON.stringify({ taskStatus: 'complete', marketingPlan: response.data.choices[0].message.content }),
			}
		} else {
			return {
				statusCode: 1,
				body: JSON.stringify({ taskStatus: 'pending', marketingPlan: null })
			}
		}
	} catch (error) {
		console.error('Error:', error)
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error.toString() }),
		}
	}
}
