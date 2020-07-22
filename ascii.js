let opts = process.argv
let avblArgs = {
  'in':'',
  'out':'',
  'resoltion':'',
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
