import mongoose from 'mongoose'
const playerSubmissionSchema = mongoose.Schema({
  playername: {
    type: String
  },
  score: {
    type: Number
  },
  choices: [
    {
      type: Number
    }
  ]
})
const submissionSchema = mongoose.Schema({
  roomname: {
    type: String
  },
  playersubmissions: [
    {
      type: playerSubmissionSchema
    }
  ]
})

submissionSchema.index({ roomname: 1 }, { unique: true })

export const submissionModel = mongoose.model('Submission', submissionSchema)
