import express from 'express'
import { submissionModel } from '../models/mongoosemodels/submissions'

const playerrouter = express.Router()

playerrouter.post('/submitchoices', async (request, response) => {
  try {
    console.log('submit choice called', request.body)

    const findexperiment = await submissionModel
      .findOne({
        roomname: request.body.roomname,
        'playersubmissions.playername': request.body.playername
      })
      .then(async (resp) => {
        console.log('calling update', resp)
        if (resp !== null) {
          console.log('updating model')
          await submissionModel
            .findOneAndUpdate(
              {
                roomname: request.body.roomname,
                'playersubmissions.playername': request.body.playername
              },
              {
                $set: {
                  'playersubmissions.$': {
                    playername: request.body.playername,
                    score: -1,
                    choices: request.body.playersubmissions
                      .slice(0, -1)
                      .split(',')
                  }
                }
              },
              { new: true, upsert: true }
            )
            .then((resp) => {
              console.log('after update', resp)
            })
            .catch((error) => {
              console.log('errrrr', error)
            })
        } else {
          /**
           * create model
           */
          console.log('creating model')
          await submissionModel
            .findOneAndUpdate(
              {
                roomname: request.body.roomname
              },
              {
                $push: {
                  playersubmissions: {
                    playername: request.body.playername,
                    score: -1,
                    choices: request.body.playersubmissions
                      .slice(0, -1)
                      .split(',')
                  }
                }
              },
              { new: true, upsert: true }
            )
            .then((resp) => {
              console.log('after update', resp)
            })
            .catch((error) => {
              console.log('errrrr', error)
            })
        }
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
