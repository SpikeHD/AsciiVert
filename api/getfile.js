const fs = require('fs')
const path = require('path')
const { dirSanitize } = require('./helper')

exports.fileRoute = (app) => {
  app.get('/file', async (req, res) => {
    if (!req.query.id) return res.status(400).send('Invalid form body')

    let id = dirSanitize(req.query.id)

    // Get file path using parameters
    let folder = path.resolve(`./temp/completed/${id}/`)

    // Check for file
    if (!fs.existsSync(folder) ||
        fs.readdirSync(folder).length === 0) return res.status(404).send('File not found')

    // Send file (there should only ever be one)
    res.sendFile(folder + '/' + fs.readdirSync(folder)[0])
  })
}