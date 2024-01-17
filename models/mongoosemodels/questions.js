import mongoose from 'mongoose'
const questionSchema = mongoose.Schema({
  questionid: {
    type: String
  },
  questiontxt: {
    type: String
  },
  choices: [
    {
      type: String
    }
  ],
  answer: {
    type: Number
  },
  roomname: {
    type: String
  }
})
questionSchema.index({ questionid: 1, roomname: 1 }, { unique: true })

export const QuestionModel = mongoose.model('Question', questionSchema)
