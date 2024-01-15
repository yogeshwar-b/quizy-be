import mongoose from 'mongoose'
import { PORT, mongourl } from './config'
import express, { json } from 'express'
import hostrouter from './routes/hostroutes'
import cors from 'cors'
import { frontendurl } from './config'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
app.use(express.json())

const server = http.createServer(app)

//CORS policy
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

io.on('connection', (socket) => {
  socket.on('hello', (arg, callback) => {
    console.log('inside hello')
    // console.log(arg, arg.room, arg.msg)
    socket.to(arg.room).emit('hello', 'someone sent ' + JSON.stringify(arg.msg))
  })
  socket.on('join', (arg, callback) => {
    console.log(arg) // "world"
    //Join room named arg
    socket.join(arg)
    socket.emit('hello', `you are in ${arg}`)
    // callback('got it')
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
