const express = require('express')
const fu = require('express-fileupload')
const image = require('./image')
const video = require('./video')
let app = express()

// Allow for getting files.
app.use(fu())

// Start server.
app.listen(8080, () => {
  image.imageRoute(app)
  video.videoRoute(app)
  console.log('API Server is up')
})