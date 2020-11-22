const mongoose = require('mongoose')
const { DBCONNECTION } = require('../config')

module.exports = {
  init: () => {
    mongoose.connect(DBCONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    mongoose.Promise = global.Promise
    mongoose.connection.on('connected', () =>
      console.log('Mongoose est connecté.')
    )
  }
}
