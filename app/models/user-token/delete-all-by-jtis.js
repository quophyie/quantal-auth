/**
 * Created by dman on 27/06/2017.
 */
const Bluebird = require('bluebird')
/**
 * Find a single token given the jti of the token
 * @param jtis
 * @returns {*}
 */
module.exports = function (jtis) {
  return this
        .query(qb => {
          qb.whereIn('jti', jtis)
        })
        .fetchAll()
        .then(models => {
          return Bluebird.map(models.map(model => model.destroy()), deleted => deleted)
        })
}
