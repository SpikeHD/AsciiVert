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

  console.log('Converting frames to text...')

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
    
    let written = await imageProc.textToImage(outdir + text.filename, text.obj)
    return written
  })

  await Promise.all(convertedImages)

  console.log('Done!')
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
  // Progress bar values
  let cur = 0
  let percent = 0

  let frames = fs.readdirSync(framesPath)
  frames.sort((a, b) => {
    let aNum = Number(a.replace(/[^0-9]/g, ''))
    let bNum = Number(b.replace(/[^0-9]/g, ''))
    
    return aNum - bNum
  })

  // Make video file into mp3 (should just work without any weird conversion)
  await fs.copyFileSync(original, original.replace(/\.[^.]*$/, '.mp3'))

  // Create new converter instance
  let conv = new Converter()
  let input = conv.input({
    f: 'image2pipe',
    framerate: framerate
  })

  // Set audio input
  conv.input(original.replace(/\.[^.]*$/, '.mp3'))
  conv.output(outfile, {
    vcodec: 'libx264',
    pix_fmt: 'yuv420p'
  })

  frames.map(fname => () => 
    new Promise((resolve, reject) =>
      fs.createReadStream(framesPath + fname)
      .on('end', resolve)
      .on('error', reject)
      .pipe(input, {
        end: false
      })
    )
  ).reduce((prev, next) => prev.then(next), Promise.resolve()).then(() => input.end())

  conv.run()
}
