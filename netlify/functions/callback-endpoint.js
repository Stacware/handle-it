const axios = require('axios')

exports.handler = async (event) => {
	try {
		// Extract the marketing plan from the request body
		const { marketingPlan } = JSON.parse(event.body)

		// Handle the marketing plan data (e.g., save to database, send email, etc.)
		console.log('Received marketing plan:', marketingPlan)

		// Return a success response
		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'Callback received successfully', marketingPlan: marketingPlan }),
		}
	} catch (error) {
		console.error('Callback Error:', error)
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error.toString() }),
		}
	}
}
