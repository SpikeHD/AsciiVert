/**
 * 
 * @param {Number} status 
 * @param {String} message 
 */
exports.HTTPError = (status, message) => {
  return Buffer(JSON.stringify({status: status, message: message}))
}