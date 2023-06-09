exports.handler = async (event, context) => {
	const { Configuration, OpenAIApi } = require('openai')
	const Parse = require('parse/node')

	Parse.initialize(process.env.BACK4APP_KEY, null, process.env.MASTER_KEY)
	Parse.serverURL = 'https://parseapi.back4app.com/'
	const body = JSON.parse(event.body)
	const payload = body.payload
	const userId = body.userId
	const User = Parse.Object.extend("User")
	const query = new Parse.Query(User)
	query.equalTo("objectId", userId)
	const user = await query.first({ useMasterKey: true })
	try {
		const configuration = new Configuration({
			apiKey: process.env.OPENAI_API_KEY,
		})

		const openai = new OpenAIApi(configuration)
		const response = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [{ role: 'user', content: payload }],
		})
		user.set("taskStatus", "pending")
		await user.save(null, { useMasterKey: true })
		if (response) {


			user.set("taskStatus", "complete")
			user.set("marketingPlan", response.data.choices[0].message.content)
			await user.save(null, { useMasterKey: true })

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
