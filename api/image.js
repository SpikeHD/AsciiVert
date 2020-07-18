const fs = require('fs')
const path = require('path')
const { createUniqueID } = require('../util/util')
const image = require('../processor/image')

/**
 * Route for uploading and converting a file.
 * 
 * @param {Express} app 
 */
exports.imageRoute = (app) => {
  app.post('/image', async (req, res) => {
    let file = req.files.files
    let id = createUniqueID()
    let dir = path.resolve(`./temp/images/${id}/`)

    if(!file) {
      return res.send(Buffer(JSON.stringify({message: 'failure', filename: id})))
    }

    await fs.mkdirSync(dir)
    await fs.writeFileSync(`${dir}/${file.name}`, file.data)

    let text = await image.imageToText(`${dir}/${file.name}`, {width: 400, height: 400})
    
    await image.textToImage(`${dir}/converted.jpg`, text)

    res.sendFile(`${dir}/converted.jpg`)
  })
}