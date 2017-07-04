const BaseRepository = require('qute-bookshelf-repository')
const GiphyModel = require('../../models/giphy')

class GiphyRepository extends BaseRepository {
  /**
   * Repositories must call BaseRepository constructor
   */
  constructor () {
    super(GiphyModel)
  }
}

module.exports = GiphyRepository
