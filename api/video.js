const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
const { createUniqueID } = require('../util/util')
const video = require('../processor/video')
const { frame_limit, resolution_limit } = require('../config.json')
const mimes = [
  'video/mp4'
]

/**
 * Route for uploading and converting videos.
 * 
 * @param {Express} app 
 */
exports.videoRoute = (app) => {
  app.post('/video', async (req, res) => {
    if(!req.files) return res.status(400).send('Looks like you forgot a file!')
    
    let file = req.files.files
    let id = createUniqueID(10)
    let dir = path.resolve(`./temp/videos/${id}/`)
    let resolution = req.body && req.body.resolution ? JSON.parse(req.body.resolution):null
    let framerate = req.body && req.body.framerate ? JSON.parse(req.body.framerate):10
    let trim = req.body && req.body.trim ? JSON.parse(req.body.trim):null
    let valid_res = resolution && (resolution.width <= resolution_limit.width && resolution.height <=  resolution_limit.height)

    if(!file) return res.status(400).send('Looks like you forgot a file!')
    if(!mimes.includes(file.mimetype)) return res.status(400).send('Looks like that isn\'t a valid file format!')
    if(!valid_res) return res.status(400).send('Looks like that video resolution is too big!')

    await fs.mkdirSync(dir)

    // Make temp dirs
    await fs.mkdirSync(`${dir}/original_frames/`)
    await fs.mkdirSync(`${dir}/converted_frames`)

    // Write video file to disk
    await fs.writeFileSync(`${dir}/${file.name}`, file.data)

    // Check video length and frames to calculate whether it would go over the limit
    ffmpeg.ffprobe(`${dir}/${file.name}`, async (err, metadata) => {
      if(err) return err

      let length = metadata.format.duration
      let totalFrames = parseInt(length, 10) * framerate

      // Calculate amount of frames, and if it's too high, calculate changes needed.
      if (totalFrames > frame_limit) {
        let frameReduction = Math.round(frame_limit / length)
        let lengthReduction = frame_limit / framerate

        // If the trim actually complies with the length reduction, we can move on
        if (trim && trim.end - trim.start > lengthReduction) {
          return res.status(400).send({
            message: 'Frame limit reached, consider reducing framerate or video length',
            reduce_frames_to: frameReduction,
            reduce_length_to: lengthReduction
          })
        }
      }

      if (res.headersSent) return

      // Since we know it *should* be okay, send a response with the file ID
      res.status(200).send(id)
  
      // Export the video into frames
      await video.videoToFrames(`${dir}/${file.name}`, `${dir}/original_frames/`, framerate)
  
      // Convert each frame
      await video.convertFrames(`${dir}/original_frames/`, `${dir}/converted_frames/`, resolution)
  
      // Now that we're almost done, we create a completed directory where it can be accessed.
      await fs.mkdirSync(`./temp/completed/${id}`)
  
      // Stitch frames back into video
      await video.framesToVideo(`${dir}/converted_frames/`, `./temp/completed/${id}/${file.name.replace('.mp4', 'converted.mp4')}`, `${dir}/${file.name}`, framerate, trim)
  
      // Cleanup
      await fs.rmdirSync(dir, {recursive: true})
    })
  })
}