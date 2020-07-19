const fs = require('fs')
const path = require('path')
const { HTTPResponse, dirSanitize } = require('./helper')

exports.fileRoute = (app) => {
  app.post('/file', async (req, res) => {
    if (!req.body) return res.send(HTTPResponse(400, 'Invalid form body'))

    let id = dirSanitize(req.body.id)

    // Get file path using parameters
    let folder = path.resolve(`./temp/completed/${id}/`)

    // Check for file
    if (!fs.existsSync(folder)) return res.send(HTTPResponse(404, 'File not found'))

    // Send file (there should only ever be one)
    res.sendFile(folder + fs.readdirSync(folder)[0])
  })
}