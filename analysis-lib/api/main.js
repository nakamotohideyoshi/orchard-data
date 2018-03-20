const startAPI = require('./start-api')

startAPI()
  .then((r) => {
    if (r) {
      console.log(`Listening on port ${r}`)
      return Promise.resolve(r)
    }
  })
  .catch((err) => {
    console.log(err)
    return Promise.reject(err)
  })
