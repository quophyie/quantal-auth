'use strict'
const GiphyRepository = require('../../repositories/giphy')
const _ = require('lodash')
const axios = require('axios')
const urlencode = require('urlencode')
const CommonExceptions = require('quantal-errors')
const GIPHY_ROOT_URL = require('../../enums').GIPHY_ROOT_URL
const GIPHY_API_KEY = require('../../enums').GIPHY_API_KEY
const CommonErrors = require('quantal-errors')

class GiphyService {
  constructor () {
    this.giphyRepository = new GiphyRepository()
  }

  /**
   * Find or create - try and find the model, create one if not found
   * @param {Object} data
   * @param {Object} options
   * @return {Promise(bookshelf.Model)} single Model
   */
  findOrCreate (data) {
    return this.giphyRepository
      .findOne(data)
      .catch((err) => {
        if (err && err instanceof (CommonErrors.NotFoundError)) {
          let a = 0
        }
        const urlEncodedQuery = urlencode(data.query)
        const giphySearchUrl = `${GIPHY_ROOT_URL}/search?q=${urlEncodedQuery}&api_key=${GIPHY_API_KEY}`

        return axios.get(giphySearchUrl)
          .then((result) => {
            if (_.isEmpty(result) || _.isEmpty(result.data) || _.isEmpty(result.data.data)) {
              throw new CommonExceptions.NotFoundError('giphy not found')
            }

            const url = result.data.data[0].url
            const giphyDataToInsert = Object.assign({}, {query: data.query, url})
            return this.giphyRepository.create(giphyDataToInsert)
          })
          .then(addedGiphy => addedGiphy)
      })
  }
}

module.exports = GiphyService
