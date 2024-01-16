import mongoose from 'mongoose'
import { PORT, mongourl, frontendurl } from './config'
import express from 'express'
import hostrouter from './routes/hostroutes'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
app.use(express.json())

const server = http.createServer(app)

// CORS policy
app.use(
  cors({
    origin: frontendurl,
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeader: ['Content-Type']
  })
)
const io = new Server(server, {
  cors: {
    origin: frontendurl
  }
})

app.get('/', (request, response) => {
  return response.status(234).send('Welcome to Quizy!')
})

app.use('/quizhost', hostrouter)

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
  console.log('a user connected')
})

server.listen(PORT, () => {
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
