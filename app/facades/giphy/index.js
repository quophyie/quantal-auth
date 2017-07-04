'use strict'
const giphyRepository = new (require('../../services/giphy'))()
module.exports = Object.freeze({

  findOrCreate (data) {
    return giphyRepository.findOrCreate(data)
  }
})
