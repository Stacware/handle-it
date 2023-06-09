exports.handler = async (event, context) => {
	const { Configuration, OpenAIApi } = require('openai')

	const body = JSON.parse(event.body)
	const payload = body.payload
	const userId = body.userId

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
			const taskStatusEndpoint = 'https://your-netlify-function-url/.netlify/functions/task-status/' + context.awsRequestId

			// Set the location header in the response
			const responseBody = {
				taskStatus: 'pending',
				taskStatusEndpoint: taskStatusEndpoint,
			}

			return {
				statusCode: 202,
				headers: {
					'Content-Type': 'application/json',
					'Location': taskStatusEndpoint,
				},
				body: JSON.stringify(responseBody),
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
