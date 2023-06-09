exports.handler = async (event, context, callback) => {
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

		const marketingPlan = response.data.choices[0].message.content

		callback(null, {
			statusCode: 200,
			body: JSON.stringify({ marketingPlan }),
		})
	} catch (error) {
		console.error('Error: ', error)
		callback(null, {
			statusCode: 500,
			body: JSON.stringify({ error: error.toString() }),
		})
	}
};
