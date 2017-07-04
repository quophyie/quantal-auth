/**
 * Created by dman on 25/06/2017.
 */

module.exports = Object.freeze({
  JWT_CREDENTIAL_URL: (userId) => `/consumers/${userId}/jwt`,
  CONSUMERS_URL: `/consumers`
})
