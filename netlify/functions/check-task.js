const Parse = require('parse/node')

Parse.initialize("MrMgKMNOEjpVUlPbhbrYxdRbQAhkQZYXpByLKQzU", "A5lGWDlQV0fnIbLCeREL1MpgtTXuq7q8qYsLHjmZ")
Parse.serverURL = "https://parseapi.back4app.com"

exports.handler = async (event, context) => {
	const userId = event.path.split('/').pop()

	const User = Parse.Object.extend("User")
	const query = new Parse.Query(User)
	const user = await query.get(userId)

	const task = JSON.parse(user.get("taskId"))
	const response = task ? task : 'Still waiting...'

	return {
		statusCode: 200,
		body: JSON.stringify(response),
	}
}
