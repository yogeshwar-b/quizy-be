import express from 'express'
import { QuestionModel } from '../models/mongoosemodels/questions'

const hostrouter = express.Router()

hostrouter.get('/test', (request, response) => {
  return response.status(200).send('This is a test!')
})
/**
 * Get all questions
 */
hostrouter.get('/viewquestions', async (request, response) => {
  try {
    const questions = await QuestionModel.find({})
    return response.status(200).json(questions)
  } catch (error) {
    console.log(`error ${error}`)
    response.status(500).send({ message: error.message })
  }
})

/**
 * Get question by id
 */
hostrouter.get('/viewquestion/:qid', async (request, response) => {
  try {
    const { qid } = request.params
    const question = await QuestionModel.find({ questionid: qid })
    return response.status(200).send(question)
  } catch (error) {
    console.log(`error ${error}`)
    response.status(500).send({ message: error.message })
  }
})

/**
 * Delete question by id
 */
hostrouter.delete('/deletequestion/:qid', async (request, response) => {
  try {
    const { qid } = request.params
    const deleteResponse = await QuestionModel.deleteOne({ questionid: qid })
    if (deleteResponse.deletedCount > 0) {
      return response.status(200).send('Delete success')
    }
    return response.status(201).send('Something went wrong')
  } catch (error) {
    console.log(`error ${error}`)
    response.status(500).send({ message: error.message })
  }
})

/**
 * Route for all the other requests
 */
hostrouter.get('*', (request, response) => {
  return response
    .status(404)
    .send('Your are looking at wrong place , nothing is here')
})

/**
 * Route to save a new question
 */
hostrouter.post('/savequestion', async (request, response) => {
  try {
    if (
      !request.body.questiontxt ||
      !request.body.questionid ||
      !request.body.choices
    ) {
      return response.status(400).send({
        message: 'Request missing fields',
      })
    }
    if (request.body.answer >= request.body.choices.length) {
      return response.status(400).send({
        message: 'Answer should be within choices length',
      })
    }
    const q = await QuestionModel.create({
      questiontxt: request.body.questiontxt,
      questionid: request.body.questionid,
      choices: request.body.choices,
      answer: request.body.answer,
      sessionid: request.body.sessionid,
    })
    return response
      .status(201)
      .send(JSON.stringify({ message: 'Added Successfully' }))
  } catch (error) {
    console.log(`error ${error}`)
    response.status(500).send({ message: error.message })
  }
})

export default hostrouter
