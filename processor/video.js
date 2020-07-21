const ffmpeg = require('fluent-ffmpeg')
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
 *  Path where original frames are stored.
 * @param {String} outdir 
 *  Path where frames will be exported.
 */
exports.convertFrames = async (framesPath, outdir, resolution) => {
  const frames = fs.readdirSync(framesPath)
  let textArray = []

  // Progress bar values
  let cur = 0
  let percent = 0

  const convertedText = frames.map(async frame => {
    let retVal = await imageProc.imageToText(framesPath + frame, resolution)

    let currentPercent = Math.round((cur / frames.length) * 100)
    cur++
    if (percent != currentPercent) {
      percent = currentPercent
      util.updateProgress(percent, `${cur}/${frames.length} (${frame})`)
    }

    return textArray.push({
      obj: retVal,
      filename: frame
    })
  })

  await Promise.all(convertedText)

  // Reset progress bar values
  cur = 0
  percent = 0

  const convertedImages = textArray.map(async text => {
    let currentPercent = Math.round((cur / textArray.length) * 100)
    cur++
    if (percent != currentPercent) {
      percent = currentPercent
      util.updateProgress(percent, `${cur}/${textArray.length} (${text.filename})`)
    }
    
    let written = await imageProc.textToImage(outdir + text.filename, text.obj)
    return written
  })

  await Promise.all(convertedImages)
}

/**
 * Converts a folder full of frames to a single video.
 * 
 * @param {String} framesPath 
 *  Path full of frames.
 * @param {String} outfile 
 *  Path of the file that will be created.
 * @param {String} original 
 *  Path to original file (for audio extraction).
 */
exports.framesToVideo = async (framesPath, outfile, original, framerate) => {
  let frames = fs.readdirSync(framesPath)
  frames.sort((a, b) => {
    let aNum = Number(a.replace(/[^0-9]/g, ''))
    let bNum = Number(b.replace(/[^0-9]/g, ''))
    
    return aNum - bNum
  })

  // Make video file into mp3 (should just work without any weird conversion)
  await fs.copyFileSync(original, original.replace(/\.[^.]*$/, '.mp3'))

  return new Promise((resolve, reject) => {
    ffmpeg(framesPath + 'tn_%d.png')
      .addInputOption(`-framerate ${framerate}`)
      .input(original.replace(/\.[^.]*$/, '.mp3'))
      .output(outfile)
      .outputFps(framerate)
      .videoCodec('libx264')
      .on('end', () => resolve)
      .on('error', () => reject)
      .run()
  })
}
