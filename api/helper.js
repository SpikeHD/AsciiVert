/**
 * Send a json response with a status code and message.
 * 
 * @param {Number} status 
 * @param {String} message 
 */
exports.HTTPResponse = (status, message) => {
  return Buffer(JSON.stringify({status: status, message: message}))
}

/**
 * Sanitize string for use in directory navigation.
 * 
 * @param {String} str 
 */
exports.dirSanitize = (str) => {
  return str.replace(/[^a-zA-Z0-9]/g, '')
}