import mongoose from 'mongoose'
const roomSchema = mongoose.Schema({
  roomname: {
    type: String
  },
  roomsecret: {
    type: String
  },
  expiry: {
    type: Date
  }
})
roomSchema.index({ roomname: 1 }, { unique: true })

export const roomModel = mongoose.model('Room', roomSchema)
