const { Configuration, OpenAIApi } = require('openai')
const Parse = require('parse/node')

// Parse.initialize("MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU", "A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ")
// Parse.serverURL = "https://parseapi.back4app.com"

exports.handler = async (event, context) => {
	const Parse = require('parse/node')

	Parse.initialize('MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU', 'V4j0HjRijESDoPboQohy16nq75kHY3H6RS6Xf1ty')
	Parse.serverURL = "https://parseapi.back4app.com"

	const { Configuration, OpenAIApi } = require('openai')

	const body = JSON.parse(event.body)
	const payload = body.payload


	try {
		const configuration = new Configuration({
			organization: 'org-5C2c3cHJsvmv3cCc5WWNhZs1',
			apiKey: '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',
		})

		const openai = new OpenAIApi(configuration)
		const response = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [{ role: 'user', content: payload }],
		})

		return {
			statusCode: 200,
			body: JSON.stringify({ marketingPlan: response.data.choices[0].message.content })
		}
	} catch (error) {
		console.error('Error: ', error)
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error.toString() })
		}
	}
}
