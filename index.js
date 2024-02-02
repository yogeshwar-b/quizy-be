import mongoose from 'mongoose'
import { PORT, mongourl, frontendurl } from './config'
import express from 'express'
import hostrouter from './routes/hostroutes'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import playerrouter from './routes/playerrouter'
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

export const io = new Server(_httpserver, {
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

  socket.on('join', (arg, respcallback) => {
    if (arg.type === 'create') {
      // console.log('join', arg)
      // Join room named arg
      socket.join(arg.roomname)
      respcallback({
        msg: 'CreateSuccess',
        rooomsavailable: Object.keys(io.sockets.adapter.rooms)
      })
    } else {
      // check if room is available for 'Join' type
      const skiproomchek = true
      if (skiproomchek || io.sockets.adapter.rooms.has(arg.roomname)) {
        socket.join('join', arg.roomname)
        respcallback({
          msg: 'JoinSuccess',
          rooomsavailable: Object.keys(io.sockets.adapter.rooms)
        })
      } else {
        respcallback({
          msg: 'RoomDoesNotExist',
          rooomsavailable: Object.keys(io.sockets.adapter.rooms)
        })
      }
    }
  })

  socket.on('createroom', async (arg, respcallback) => {
    console.log('create room called' + arg)
    await roomModel
      .findOne({ roomname: arg.roomname })
      .then(async (x) => {
        if (x == null) {
          socket.join(arg.roomname)
          await roomModel
            .create({
              roomname: arg.roomname,
              roomsecret: arg.roomsecret,
              expiry: Date.now()
            })
            .then(
              respcallback({
                msg: 'CreateSuccess'
              })
            )
        } else {
          respcallback({
            msg: 'CreateFailed'
          })
        }
      })
      .catch((err) => {
        console.log(err)
        respcallback({
          msg: 'Error'
        })
      })
  })

  socket.on('manageroom', async (arg, respcallback) => {
    console.log('manage room called', arg)
    await roomModel
      .findOne({ roomname: arg.roomname, roomsecret: arg.roomsecret })
      .then((x) => {
        if (x !== null) {
          socket.join(arg.roomname)
          respcallback({
            msg: 'JoinSuccess'
          })
        } else {
          respcallback({
            msg: 'JoinFailed'
          })
        }
      })
      .catch((error) => {
        console.log(error)
        respcallback({
          msg: 'Error'
        })
      })
  })

  socket.on('joinroom', async (arg, respcallback) => {
    console.log('join room called', arg)
    await roomModel
      .findOne({ roomname: arg.roomname })
      .then((x) => {
        if (x !== null) {
          socket.join(arg.roomname)
          respcallback({
            msg: 'JoinSuccess'
          })
        } else {
          respcallback({
            msg: 'JoinFailed'
          })
        }
      })
      .catch((error) => {
        console.log(error)
        respcallback({
          msg: 'Error'
        })
      })
  })
  console.log('a user connected')
})

app.get('/', (request, response) => {
  return response.status(234).send('Welcome to Quizy!')
})

app.use('/quizhost', hostrouter)
app.use('/player', playerrouter)

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
