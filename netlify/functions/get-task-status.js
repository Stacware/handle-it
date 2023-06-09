exports.handler = async (event, context) => {
	const Parse = require('parse/node')

	Parse.initialize('MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU', 'A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ')
	Parse.serverURL = 'https://parseapi.back4app.com/'
	const userId = event.queryStringParameters.userId

	try {
		const User = Parse.Object.extend("User")
		const query = new Parse.Query(User)
		query.equalTo("objectId", userId)
		const user = await query.first()

		const taskStatus = user.get("taskStatus")

		return {
			statusCode: 200,
			body: JSON.stringify({ taskStatus: taskStatus }),
		}
	} catch (error) {
		console.error('Error:', error)
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error.toString() }),
		}
	}
}
