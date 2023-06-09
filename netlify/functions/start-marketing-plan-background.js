const axios = require('axios')

exports.handler = async (event, context) => {
	const { Configuration, OpenAIApi } = require('openai')

	const body = JSON.parse(event.body)
	const payload = body.payload
	const callbackUrl = body.callbackUrl

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
			// Send the OpenAI response to the callback URL
			await sendCallbackResponse(callbackUrl, response.data.choices[0].message.content)

			return {
				statusCode: 200,
				body: JSON.stringify({ message: 'Callback sent successfully' }),
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

async function sendCallbackResponse (url, content) {
	try {
		await axios.post(url, { marketingPlan: content })
		console.log('Callback sent successfully')
	} catch (error) {
		console.error('Callback Error:', error)
	}
}
