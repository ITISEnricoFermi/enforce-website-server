const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const socketIO = require('socket.io')
const path = require('path')
const helmet = require('helmet')
const history = require('connect-history-api-fallback')

var app = express()
var server = http.createServer(app)
const io = socketIO(server)

const port = process.env.PORT || 3000

app.use(history())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())

app.use(express.static(path.join(__dirname, '/public')))

io.on('connection', (socket) => {
  // socket.on('event', () => {
  //   io.emit('event')
  // })
  console.log('User connected')

  socket.on('temperature', (temperature) => {
    socket.broadcast.emit('temperature', temperature)
  })

  socket.on('humidity', (humidity) => {
    socket.broadcast.emit('humidity', humidity)
  })

  socket.on('pressure', (pressure) => {
    socket.broadcast.emit('pressure', pressure)
  })

  socket.on('position', (position) => {
    socket.broadcast.emit('position', position)
  })

  socket.on('orientation', (orientation) => {
    socket.broadcast.emit('orientation', orientation)
  })
})

app.use((err, req, res, next) => {
  res.status(500).send({
    messages: [err.message]
  })
  next(err)
})

server.listen(port, () => {
  console.log(`Server started on port ${port}.`)
})
