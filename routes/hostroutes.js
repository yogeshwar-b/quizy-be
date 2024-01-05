import express from 'express'
import { QuestionModel } from '../models/mongoosemodels/questions'

const hostrouter = express.Router()

hostrouter.get('/test', (request, response) => {
  // console.log(request)
  return response.status(200).send('This is a test!')
})
/**
 * Route to view all questions
 */
hostrouter.get('/viewquestions', async (request, response) => {
  try {
    const questions = await QuestionModel.find({})
    // console.log(questions)
    return response.status(200).json(questions)
  } catch (error) {
    console.log(`error ${error}`)
    response.status(500).send({ message: error.message })
  }
})

hostrouter.get('*', (request, response) => {
  return response.status(404).send('Your are looking at wrong place , nothing is here')
})

/**
 * Route to save a new question
 */
hostrouter.post('/savequestion', async (request, response) => {
  try {
    if (!request.body.questiontxt ||
      !request.body.questionid ||
      !request.body.choices) {
      return response.status(400).send({
        message: 'Request missing fields'
      })
    }
    if (request.body.answer >= request.body.choices.length) {
      return response.status(400).send({
        message: 'Answer should be within choices length'
      })
    }
    const q = await QuestionModel.create({
      questiontxt: request.body.questiontxt,
      questionid: request.body.questionid,
      choices: request.body.choices,
      answer: request.body.answer
    })
    return response.status(201).send(q)
  } catch (error) {
    console.log(`error ${error}`)
    response.status(500).send({ message: error.message })
  }
})

export default hostrouter
