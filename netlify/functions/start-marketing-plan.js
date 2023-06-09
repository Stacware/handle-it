const cors = require('cors')
const { Configuration, OpenAIApi } = require('openai')
const express = require('express')
const serverless = require('serverless-http')
const app = express()
const { v4: uuidv4 } = require('uuid')


app.use(cors())
app.use(express.json())

app.post('/.netlify/functions/start-marketing-plan', async (req, res) => {
	// const taskId = uuidv4()
	// const payload = req.body.payload
	// createMarketingPlan(payload, taskId)
	// res.json({ taskId })
	const configuration = new Configuration({
		organization: 'org-5C2c3cHJsvmv3cCc5WWNhZs1',
		apiKey: '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',
	})
	const openai = new OpenAIApi(configuration)
	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: [{ role: 'user', content: payload }],
	})
	res.json(response)
})

app.get('/.netlify/functions/check-task/:taskId', (req, res) => {
	const taskId = req.params.taskId
	const task = tasks.get(taskId)
	task ? res.json(task) : res.json('Still waiting...')
})

// Marketing Plan Creation
const tasks = new Map()

// async function createMarketingPlan (payload, taskId) {
// 	const configuration = new Configuration({
// 		organization: 'org-5C2c3cHJsvmv3cCc5WWNhZs1',
// 		apiKey: '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',
// 	})
// 	const openai = new OpenAIApi(configuration)
// 	const response = await openai.createChatCompletion({
// 		model: 'gpt-3.5-turbo',
// 		messages: [{ role: 'user', content: payload }],
// 	})
// 	updateTaskStatus(taskId, response)
// }

// Update Task Status
function updateTaskStatus (taskId, result) {
	if (result) {
		tasks.set(taskId, { status: 'complete', result: result.data.choices })
	} else {
		console.error(result)
		tasks.set(taskId, { status: 'error', error: 'An error occurred' })
	}
}

module.exports.handler = serverless(app)
