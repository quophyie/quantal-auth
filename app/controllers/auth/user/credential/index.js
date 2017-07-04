/**
 * Created by dman on 03/07/2017.
 */

const userTokenFacade = require('../../../../facades/user-token-facade/index')
module.exports = (router) => {
  router.post('/', (req, res, next) => {
    const idOrEmail = req.body['userId'] || req.body['email']
    const claims = req.body.claims
    userTokenFacade.createToken(idOrEmail, claims)
            .then(result => res.json(result))
            .catch(next)
  })
}
