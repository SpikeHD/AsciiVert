const fs = require('fs')
const jimp = require('jimp')
const symbols = ['@', '#', '$', '%', ';', ':', '^', '*', ',', '.', '\'', ' ']

/**
 * Convert a single image file to ascii art.
 * 
 * @param {String} infile 
 * @param {String} outfile 
 * @param {Object} resolution 
 */
exports.imageToAscii = (infile, resolution) => {
  return new Promise(async (resolve, reject) => {
    jimp.read(infile, (err, img) => {
      if(err) reject(err)
      
      let str = ''
      let downscale = {
        x: img.bitmap.width / resolution.width,
        y: img.bitmap.height / resolution.height
      }

      // Iterate through each pixel in the image
      for (let y = 0; y <= resolution.height; y++) {
        let row = ''

        for (let x = 0; x <= resolution.width; x++) {
          // Since we downscale we only get the relevant pixels, evenly calculated/distributed
          let rgba = jimp.intToRGBA(img.getPixelColor(x * downscale.x, y * downscale.y))
          row += calculateSymbol(rgba, symbols)

          // If we're done, start the next row
          if(x == resolution.width) str += row + '\n'
        }

        if(y == resolution.height) {
          resolve({
            width: resolution.width,
            height: resolution.height,
            content: str
          })
        }
      }
    })
  })
}

function calculateSymbol(color, symbols) {
  // https://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx
  let brightness = Math.sqrt(
    (.241 * color.r * color.r) +
    (.691 * color.g * color.g) +
    (.068 * color.b * color.b)
  )

  let index = Math.round(brightness / (255 / (symbols.length-1)))

  // Return the symbol with a space appended to the beginning.
  return ` ${symbols[index]}`
}