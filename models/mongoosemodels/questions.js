import mongoose from 'mongoose'
const questionSchema = mongoose.Schema({
  questionid: {
    type: String
  },
  questiontxt: {
    type: String
  },
  choices: [{
    type: String
  }],
  answer: {
    type: Number
  },
  sessionid: {
    type: String
  }
})
questionSchema.index({ questionid: 1, sessionid: 1 }, { unique: true })

export const QuestionModel = mongoose.model('Question', questionSchema)
