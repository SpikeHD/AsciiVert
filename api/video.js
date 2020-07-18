/**
 * Route for uploading and converting videos.
 * 
 * @param {Express} app 
 */
exports.videoRoute = (app) => {
  app.get('/video', (req, res) => {
    res.end(Buffer.from("{ message: 'Success' }"))
  })
}