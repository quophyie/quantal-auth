/**
 * Created by dman on 27/06/2017.
 */

/**
 * Find a single token given the jti of the token
 * @param jti
 * @returns {*}
 */
module.exports = function (jti) {
  return this
        .findOne({jti: jti})
        .then(model => model.destroy({jti: jti}))
}
