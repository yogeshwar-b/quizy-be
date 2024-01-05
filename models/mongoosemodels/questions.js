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
  }
})

export const QuestionModel = mongoose.model('Question', questionSchema)
