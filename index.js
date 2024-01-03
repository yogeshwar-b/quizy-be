import Bun from 'bun'
import mongoose from 'mongoose'
import { mongourl } from './config'

const server = Bun.serve({
  port: 3000,
  fetch (req) {
    const url = new URL(req.url)
    if (url.pathname === '/') return new Response('Welcome to Quizy!')
    if (url.pathname === '/test') {
      return new Response('This is test', { status: 200 })
    }
    return new Response('Request not found!', { status: 404 })
  }
})

console.log(`Listening on http://localhost:${server.port} ...`)

mongoose
  .connect(mongourl)
  .then(() => {
    console.log('connection success')
  })
  .catch((error) => {
    console.log(`error ${error}`)
  })
