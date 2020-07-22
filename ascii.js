const api = require('./api/api')
const imageProc = require('./processor/image')
const videoProc = require('./processor/video')
const fs = require('fs')

let opts = process.argv
let avblArgs = {
  'in':'',
  'out':'',
  'resolution':'',
  'framerate':'',
  'api':false
}

for (let i = 0; i < opts.length; i++) {
  if (opts[i].startsWith('-')) {
    // Get part of flag after hyphen
    let argVal = opts[i].split('-')[opts[i].lastIndexOf('-') + 1]
    // Get matching argument in avblArgs
    let avblArg = Object.keys(avblArgs).filter(x => x.startsWith(argVal[0]))
    
    if(typeof(avblArgs[avblArg]) === 'boolean' && (opts[i + 1] && opts[i + 1].startsWith("-") || !opts[i + 1])) {
      // If the argument has no value associated with it, assume boolean
      avblArgs[avblArg] = true

      // Otherwise, assume actual
    } else avblArgs[avblArg] = opts[i + 1];
  }
}

// First, simply check if we just want to activate the API
if (avblArgs.api) return api.start()

(async () => {

})()
// If no framerate provided, assume image conversion
if (!avblArgs.framerate) {
  doImage()
} else {
  doVideo()
}

async function doImage() {
  // Split width and length of resolution
  const resArray = avblArgs.resolution.split('x')
  // Create resolution array
  const resObj = {
    width: Number(resArray[0]),
    height: Number(resArray[1])
  }
  // Create textObj
  console.log('Converting image to text...')
  const textObj = await imageProc.imageToText(avblArgs.in, resObj)
  
  // Process image
  console.log('Processing and writing image...')
  await imageProc.textToImage(avblArgs.out, textObj)
}

async function doVideo() {
  // Split width and length of resolution
  const resArray = avblArgs.resolution.split('x')
  // Create resolution array
  const resObj = {
    width: resArray[0],
    height: resArray[1]
  }

  // Make temp dirs
  console.log('Make temp dirs...')
  if (fs.existsSync('./temp_orig/')) await fs.rmdirSync('./temp_orig/', { recursive: true })
  await fs.mkdirSync('./temp_orig/')
  if (fs.existsSync('./temp_conv/')) await fs.rmdirSync('./temp_conv/', { recursive: true })
  await fs.mkdirSync('./temp_conv/')

  // Process video
  console.log('Converting video to raw frames...')
  await videoProc.videoToFrames(avblArgs.in, './temp_orig/', avblArgs.framerate)
  console.log('Converting frames to ascii frames...')
  await videoProc.convertFrames('./temp_orig/', './temp_conv/', resObj, true)
  console.log('Splicing frames back into video')
  await videoProc.framesToVideo('./temp_conv/', avblArgs.out, avblArgs.in, avblArgs.framerate)

  // Remove temp dirs
  await fs.rmdirSync('./temp_orig/', { recursive: true })
  await fs.rmdirSync('./temp_conv/', { recursive: true })
}
