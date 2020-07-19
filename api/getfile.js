const fs = require('fs')
const path = require('path')
const { HTTPError } = require('./helper')

exports.fileRoute = (app) => {
  app.post('/file', async (req, res) => {
    if (!req.body) return res.send(HTTPError(400, 'Invalid form body'))

    // Get file path using parameters
    let file = path.resolve(`./temp/${req.body.type}s/${req.body.id}/${req.body.filename}`)

    // Check for file
    if (!fs.existsSync(file)) return res.send(HTTPError(404, 'File not found'))

    // Send file
    res.sendFile(file)
  })
}