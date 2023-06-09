const { Configuration, OpenAIApi } = require('openai')
exports.handler = async (event, context) => {
	// Import Parse
	const Parse = require('parse')

	// Parse initialization
	Parse.initialize('MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU', 'A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ')
	Parse.serverURL = 'https://parseapi.back4app.com/'

	const body = JSON.parse(event.body)
	const payload = body.payload

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
			const user = Parse.User.current()
			user.set('taskStatus', 'complete')
			user.set('marketingPlan', response.data.choices[0].message.content)
			await user.save()

			return {
				statusCode: 200,
				body: JSON.stringify({ taskStatus: 'complete' })
			}
		}
	} catch (error) {
		console.error('Error:', error)
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error.toString() })
		}
	}
}
