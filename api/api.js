const express = require('express')
const fu = require('express-fileupload')
const fs = require('fs')
const path = require('path')
const image = require('./image')
const video = require('./video')
let app = express()

// Setup files in case they do not exist.
if(!fs.existsSync(path.resolve(`./temp/`))) fs.mkdirSync(path.resolve(`./temp/`))
if(!fs.existsSync(path.resolve(`./temp/images/`))) fs.mkdirSync(path.resolve(`./temp/images/`))
if(!fs.existsSync(path.resolve(`./temp/videos/`))) fs.mkdirSync(path.resolve(`./temp/videos/`))

// Allow for getting files.
app.use(fu())

// Start server.
app.listen(8080, () => {
  image.imageRoute(app)
  video.videoRoute(app)
  console.log('API Server is up')
})