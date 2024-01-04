import express from 'express'

const hostrouter = express.Router()

hostrouter.get('/test', (request, response) => {
  console.log(request)
  return response.status(200).send('This is a test!')
})

hostrouter.get('*', (request, response) => {
  return response.status(404).send('Your are looking at wrong place , nothing is here')
})

export default hostrouter
