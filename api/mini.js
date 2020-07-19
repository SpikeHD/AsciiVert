const fs = require('fs')
const path = require('path')
const { createUniqueID } = require('../util/util')
const image = require('../processor/image')
const { HTTPResponse } = require('./helper')
const mimes = [
  'image/png',
  'image/jpeg'
]

/**
 * Route for sending a tiny version of an image.
 * 
 * @param {Express} app 
 */
exports.miniRoute = (app) => {
  app.post('/mini', async (req, res) => {
    if(!req.files) return res.send(HTTPResponse(400, 'Looks like you forgot a file!'))
    
    let file = req.files.files
    let id = createUniqueID()
    let dir = path.resolve(`./temp/images/${id}/`)
    let resolution = req.body && req.body.resolution ? JSON.parse(req.body.resolution):null
  
    // Data checking
    if(!file) return res.send(HTTPResponse(400, 'Looks like you forgot a file!'))
    if(!mimes.includes(file.mimetype)) return res.send(HTTPResponse(400, 'Looks like that isn\'t a supported file...'))
  
    // Create temp dir for files
    await fs.mkdirSync(dir)
    await fs.writeFileSync(`${dir}/${file.name}`, file.data)
  
    // Get text from image
    let text = await image.imageToText(`${dir}/${file.name}`, resolution)
    
    // Send text content
    res.status(200).send(text)
  
    // Cleanup
    await fs.rmdirSync(dir, { recursive: true })
  })
}