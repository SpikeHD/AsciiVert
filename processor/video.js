const ffmpeg = require('fluent-ffmpeg')
const {Converter} = require('ffmpeg-stream')
const imageProc = require('./image')
const util = require('../util/util')
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

/**
 * Convert all images (frames) in a path to ascii.
 * 
 * @param {String} framesPath 
 * @param {String} outdir 
 */
exports.convertFrames = (framesPath, outdir, resolution) => {
  return new Promise(async (resolve, reject) => {
    const frames = fs.readdirSync(framesPath)
    let textArray = []

    // Progress bar values
    let cur = 0
    let percent = 0

    console.log('Converting frames to text...')

    const convertedText = frames.map(async frame => {
      let retVal

      await imageProc.imageToText(framesPath + frame, resolution).then(res => {
        let currentPercent = Math.round((cur / frames.length) * 100)
        cur++
        if (percent != currentPercent) {
          percent = currentPercent
          util.updateProgress(percent, `${cur}/${frames.length} (${frame})`)
        }

        retVal = res
      })

      textArray.push({
        obj: retVal,
        filename: frame
      })
    })

    await Promise.all(convertedText)

    console.log('Done!')

    // Reset progress bar values
    cur = 0
    percent = 0

    console.log('Converting text to images...')

    const convertedImages = textArray.map(async text => {
      let currentPercent = Math.round((cur / textArray.length) * 100)
      cur++
      if (percent != currentPercent) {
        percent = currentPercent
        util.updateProgress(percent, `${cur}/${textArray.length} (${text.filename})`)
      }

      await imageProc.textToImage(outdir + text.filename, text.obj)
    })

    await Promise.all(convertedImages)

    console.log('Done!')
  })
}
