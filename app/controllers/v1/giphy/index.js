'use strict'
const giphyFacade = require('./../../../facades/giphy')

module.exports = (router) => {
  router.get('/:query', (req, res) => {
    const data = {
      query: req.params.query
    }
    giphyFacade
      .findOrCreate(data)
      .then(giphy => res.json(giphy))
  })

  router.post('/', (req, res) => {
    res.json({ message: 'POST ok' })
  })
}
