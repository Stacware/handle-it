exports.handler = async (event, context) => {
	const { Configuration, OpenAIApi } = require('openai')

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
			return {
				statusCode: 200,
				body: JSON.stringify({ marketingPlan: response.data.choices[0].message.content })
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
