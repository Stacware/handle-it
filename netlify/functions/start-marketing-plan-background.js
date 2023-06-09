const { Configuration, OpenAIApi } = require('openai')
const Parse = require('parse/node')

Parse.initialize("MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU", "A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ")
Parse.serverURL = "https://parseapi.back4app.com"

async function createMarketingPlan (payload, userId) {
	const configuration = new Configuration({
		organization: 'org-5C2c3cHJsvmv3cCc5WWNhZs1',
		apiKey: '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',
	})
	const openai = new OpenAIApi(configuration)
	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: [{ role: 'user', content: payload }],
	})

	const User = Parse.Object.extend("User")
	const query = new Parse.Query(User)
	const user = await query.get(userId)

	user.set("taskStatus", response ? 'complete' : 'error')
	user.set("taskResult", response ? response.data.choices : null)

	await user.save()
}

exports.handler = async (event, context) => {
	const payload = JSON.parse(event.body).payload
	const userId = JSON.parse(event.body).userId // Assuming the userId is sent in the request

	const User = Parse.Object.extend("User")
	const query = new Parse.Query(User)
	const user = await query.get(userId)

	user.set("taskStatus", 'pending')
	await user.save()

	createMarketingPlan(payload, userId)

	return {
		statusCode: 200,
		body: JSON.stringify({ status: 'Task started' }),
	}
}
