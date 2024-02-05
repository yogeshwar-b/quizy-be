import express from 'express'
import { submissionModel } from '../models/mongoosemodels/submissions'

const utilityrouter = express.Router()

utilityrouter.get('/scoreboard/:roomname', (request, response) => {
  const { roomname } = request.params
  submissionModel
    .aggregate([
      { $match: { roomname } },
      // unwind converts {a:{b:[x,y,z]}} to {a:{b:x},a:{b:y},a:{b:z}}
      { $unwind: '$playersubmissions' },
      { $sort: { 'playersubmissions.score': -1 } },
      {
        $group: {
          _id: '$_id',
          playersubmissions: {
            $push: {
              playername: '$playersubmissions.playername',
              score: '$playersubmissions.score'
            }
          }
        }
      }
    ])
    .then((resp) => {
      //   console.log(resp)
      return response.status(200).send(resp[0])
    })
    .catch((err) => {
      console.log(err)
      return response.status(404).send({ message: 'Scores not found' })
    })
})

export default utilityrouter
