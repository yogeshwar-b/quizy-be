import express from 'express'
import { submissionModel } from '../models/mongoosemodels/submissions'

const playerrouter = express.Router()

playerrouter.post('/submitchoices', async (request, response) => {
  try {
    console.log('submit choice called', request.body)
    await submissionModel.create({
      playersubmissions: {
        playername: request.body.playername,
        score: -1,
        choices: request.body.playersubmissions.slice(0, -1).split(',')
      },
      roomname: request.body.roomname
    })
    return response
      .status(201)
      .send(JSON.stringify({ message: 'Added Successfully' }))
  } catch (error) {
    console.log(`error ${error}`)
    response.status(500).send({ message: error.message })
  }
})

export default playerrouter
