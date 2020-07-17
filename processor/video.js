const ffmpeg = require('fluent-ffmpeg')
const {Converter} = require('ffmpeg-stream')
const fs = require('fs')

/**
 * Convert a video file to frames.
 * 
 * @param {String} path 
 *  Path to video file.
 * @param {String} outdir
 *  Path to send exported frames.
 * @param {Number} framerate
 *  Framerate. 
 */
exports.videoToFrames = (path, outdir, framerate) => {
  return new Promise((resolve, reject) => {
    let duration
    ffmpeg.ffprobe(path, (err, metadata) => {
      if(err) reject(err)

      duration = metadata.format.duration

      console.log(duration)

      ffmpeg(path)
        .on('error', (e) => reject(e))
        .screenshots({
          count: Math.floor(framerate * duration),
          folder: outdir
        })
        .on('end', () => {
          let frames = fs.readdirSync(outdir)
          frames.sort((a, b) => {
            let aNum = Number(a.replace(/[^0-9]/g, ''))
            let bNum = Number(b.replace(/[^0-9]/g, ''))
            
            return aNum - bNum
          })

          resolve(frames)
        })
    })
  })
}
