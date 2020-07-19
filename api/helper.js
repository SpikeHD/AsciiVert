/**
 * Sanitize string for use in directory navigation.
 * 
 * @param {String} str 
 */
exports.dirSanitize = (str) => {
  return str.replace(/[^a-zA-Z0-9]/g, '')
}