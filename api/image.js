const fs = require('fs')
const path = require('path')
const { createUniqueID } = require('../util/util')
const image = require('../processor/image')
const { HTTPError } = require('./helper')

/**
 * Route for uploading and converting a file.
 * 
 * @param {Express} app 
 */
exports.imageRoute = (app) => {
  app.post('/image', async (req, res) => {
    if(!req.files) return res.send(HTTPError(400, 'Looks like you forgot a file!'))
    
    let file = req.files.files
    let id = createUniqueID()
    let dir = path.resolve(`./temp/images/${id}/`)
    let resolution = req.body && req.body.resolution ? req.body.resolution:null

    if(!file) {
      return res.send(HTTPError(400, 'Looks like you forgot a file!'))
    }

    await fs.mkdirSync(dir)
    await fs.writeFileSync(`${dir}/${file.name}`, file.data)

    let text = await image.imageToText(`${dir}/${file.name}`, resolution)
    
    await image.textToImage(`${dir}/converted.jpg`, text)

    res.sendFile(`${dir}/converted.jpg`)
  })
}