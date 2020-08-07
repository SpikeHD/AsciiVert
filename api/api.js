const express = require('express')
const fu = require('express-fileupload')
const rl = require('express-rate-limit')
const fs = require('fs')
const path = require('path')
const image = require('./image')
const video = require('./video')
const file = require('./getfile')
const mini = require('./mini')
const { fileExpiration } = require('../config.json')
const lim = rl({
  windowMs: 10 * 1000, // 10 seconds
  max: 10
})
let app = express()

// Setup files in case they do not exist.
if(!fs.existsSync(path.resolve(`./temp/`))) fs.mkdirSync(path.resolve(`./temp/`))
if(!fs.existsSync(path.resolve(`./temp/images/`))) fs.mkdirSync(path.resolve(`./temp/images/`))
if(!fs.existsSync(path.resolve(`./temp/videos/`))) fs.mkdirSync(path.resolve(`./temp/videos/`))
if(!fs.existsSync(path.resolve(`./temp/completed/`))) fs.mkdirSync(path.resolve(`./temp/completed/`))

// Allow for getting files.
app.use(fu())

/**
 * Start the API server.
 */
exports.start = () => {
  // Start server.
  app.listen(8080, () => {
    image.imageRoute(app, lim)
    video.videoRoute(app, lim)
    file.fileRoute(app)
    mini.miniRoute(app, lim)
    console.log('API Server is up')
  })
  
  // Default site route.
  app.use(express.static(path.resolve('./site/')))
  
  // Every minute, check for expired completed files and delete them.
  setInterval(() => {
    let folders = fs.readdirSync(path.resolve('./temp/completed/'))
  
    folders.forEach(folder => {
      let curPath = path.resolve(`./temp/completed/${folder}`)
      let info = fs.statSync(curPath)
      let now = Date.now()
  
      if (info.mtimeMs + fileExpiration < now) {
        fs.rmdirSync(curPath, { recursive: true })
      }
    })
  }, 60000)
}
