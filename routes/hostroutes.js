import express from 'express'
import { QuestionModel } from '../models/mongoosemodels/questions'
import crypto from 'crypto'

const hostrouter = express.Router()

hostrouter.get('/test', (request, response) => {
  return response.status(200).send('This is a test!')
})

function hash (txt) {
  return crypto.createHash('sha256').update(txt).digest('hex')
}

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
    const question = await QuestionModel.findOne({ questionid: qid })
    return response.status(200).send(question)
  } catch (error) {
    console.log(`error ${error}`)
    response.status(500).send({ message: error.message })
  }
})
/**
 * Get question by SessionId
 */
hostrouter.get(
  '/viewquestionbysession/:sessionid',
  async (request, response) => {
    try {
      const { sessionid } = request.params
      const question = await QuestionModel.find({ sessionid:  sessionid })
      return response.status(200).send(question)
    } catch (error) {
      console.log(`error ${error}`)
      response.status(500).send({ message: error.message })
    }
  }
)

/**
 * Delete question by id
 */
hostrouter.delete('/deletequestion/:qid/:sid', async (request, response) => {
  try {
    const { qid, sid } = request.params
    const deleteResponse = await QuestionModel.deleteOne({
      questionid: qid,
      sessionid: sid
    })
    if (deleteResponse.deletedCount > 0) {
      return response.status(200).send({ message:'Delete success' })
    }
    return response.status(404).send({ message:'item not found' })
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
    if (!request.body.questiontxt || !request.body.choices) {
      return response.status(400).send({
        message: 'Request missing fields'
      })
    }
    if (request.body.answer >= request.body.choices.length) {
      return response.status(400).send({
        message: 'Answer should be within choices length'
      })
    }

    const questionID = hash(request.body.questiontxt).substring(0, 32)
    const q = await QuestionModel.create({
      questiontxt: request.body.questiontxt,
      questionid: questionID,
      choices: request.body.choices,
      answer: request.body.answer,
      sessionid: request.body.sessionid
    })
    return response
      .status(201)
      .send(JSON.stringify({ message: 'Added Successfully' }))
  } catch (error) {
    console.log(`error ${error}`)
    response.status(500).send({ message: error.message })
  }
})

/**
 * @todo - check if the update was successful
 * Route to Edit a question , This needs old QuestionId and new QuestionBody request
 */
hostrouter.put('/editquestion', async (request, response) => {
  try {
    if (!request.body.questiontxt || !request.body.choices) {
      return response.status(400).send({
        message: 'Request missing fields'
      })
    }
    if (request.body.answer >= request.body.choices.length) {
      return response.status(400).send({
        message: 'Answer should be within choices length'
      })
    }
    const oldQuestionId = request.body.questionid

    const question = await QuestionModel.findOneAndUpdate(
      {
        // oldquestionid
        questionid: request.body.questionid,
        sessionid: request.body.sessionid
      },
      {
        questiontxt: request.body.questiontxt,
        questionid: hash(request.body.questiontxt).substring(0, 32),
        choices: request.body.choices,
        answer: request.body.answer,
        sessionid: request.body.sessionid
      },
      {
        returnOriginal: false
      }
    )
    // console.log(question)
    if (question === null) {
      return response
        .status(404)
        .send(JSON.stringify({ message: 'Updated Failed,did not find the specified question.' }))
    }
    return response
      .status(200)
      .send(JSON.stringify({ message: 'Updated Successfully', newQuestionid: question.questionid }))
  } catch (error) {
    console.log(`error ${error}`)
    response.status(500).send({ message: error.message })
  }
})

export default hostrouter
