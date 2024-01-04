import mongoose from 'mongoose'
import { PORT, mongourl } from './config'
import express from 'express'
import hostrouter from './routes/hostroutes'

const app = express()
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`)
})
app.get('/', (request, response) => {
  console.log(request)
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
