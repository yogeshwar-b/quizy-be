import mongoose from 'mongoose'
import { PORT, mongourl, frontendurl } from './config'
import express from 'express'
import hostrouter from './routes/hostroutes'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import { roomModel } from './models/mongoosemodels/rooms'

const app = express()
app.use(express.json())

export const _httpserver = http.createServer(app)

// CORS policy
app.use(
  cors({
    origin: frontendurl,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeader: ['Content-Type']
  })
)

const io = new Server(_httpserver, {
  cors: {
    origin: frontendurl
  }
})

/**
 * @todo - rooms available needs to be sent to client for temporary logging for development.
 */
io.on('connection', (socket) => {
  socket.on('hello', (arg, callback) => {
    console.log('inside hello')
    // console.log(arg, arg.room, arg.msg)
    socket.to(arg.room).emit('hello', 'someone sent ' + JSON.stringify(arg.msg))
  })

  socket.on('join', (arg, callback) => {
    if (arg.type === 'create') {
      // console.log('join', arg)
      // Join room named arg
      socket.join(arg.roomname)
      callback({
        msg: 'CreateSuccess',
        rooomsavailable: Object.keys(io.sockets.adapter.rooms)
      })
    } else {
      // check if room is available for 'Join' type
      const skiproomchek = true
      if (skiproomchek || io.sockets.adapter.rooms.has(arg.roomname)) {
        socket.join('join', arg.roomname)
        callback({
          msg: 'JoinSuccess',
          rooomsavailable: Object.keys(io.sockets.adapter.rooms)
        })
      } else {
        callback({
          msg: 'RoomDoesNotExist',
          rooomsavailable: Object.keys(io.sockets.adapter.rooms)
        })
      }
    }
  })

  socket.on('createroom', async (arg, callback) => {
    try {
      console.log('create room called')
      socket.join(arg.roomname)
      let skip = false
      var findobj = await roomModel
        .findOne({ roomname: arg.roomname })
        .then((x) => {
          skip = true
        })
      if (!skip) {
        const roomdb = await roomModel.create({
          roomname: arg.roomname,
          expiry: Date.now()
        })
        callback({
          msg: 'CreateSuccess'
        })
      } else {
        callback({
          msg: 'CreateFailed'
        })
      }
    } catch (error) {
      console.log(error)
      callback({
        msg: 'Error'
      })
    }
  })

  socket.on('joinroom', async (arg, callback) => {
    try {
      console.log('join room called')
      socket.join(arg.roomname)
      let skip = true
      var findobj = await roomModel
        .findOne({ roomname: arg.roomname })
        .then((x) => {
          // console.log(x)
          if (x !== null) {
            skip = false
          }
        })
      if (!skip) {
        callback({
          msg: 'JoinSuccess'
        })
      } else {
        callback({
          msg: 'JoinFailed'
        })
      }
    } catch (error) {
      console.log(error)
      callback({
        msg: 'Error'
      })
    }
  })
  console.log('a user connected')
})

app.get('/', (request, response) => {
  return response.status(234).send('Welcome to Quizy!')
})

app.use('/quizhost', hostrouter)

_httpserver.listen(PORT, () => {
  console.log(`App is running at ${PORT}`)
})

mongoose
  .connect(mongourl)
  .then(() => {
    console.log('connection success')
  })
  .catch((error) => {
    console.log(`error ${error}`)
  })
