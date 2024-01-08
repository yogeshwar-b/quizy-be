import mongoose from 'mongoose'
import { PORT, mongourl } from './config'
import express from 'express'
import hostrouter from './routes/hostroutes'
import cors from 'cors'
import { frontendurl } from './config'

const app = express()

//CORS policy
app.use(
  cors({
    origin: frontendurl,
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeader: ['Content-Type'],
  })
)

app.use(express.json())

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`)
})
app.get('/', (request, response) => {
  return response.status(234).send('Welcome to Quizy!')
})
app.use('/quizhost', hostrouter)

mongoose
  .connect(mongourl)
  .then(() => {
    console.log('connection success')
  })
  .catch((error) => {
    console.log(`error ${error}`)
  })
