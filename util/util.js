/**
 * Write progress bar to terminal screen.
 * 
 * @param {Number} percentage 
 * @param {String} info 
 */
exports.updateProgress = (percentage, info) => {
  let bar = '#'.repeat(percentage/5) + '_'.repeat(20-(percentage/5))

  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  process.stdout.write(`[${bar}] ${percentage}% - ${info}`)

  if(percentage === 100) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
  }
}
