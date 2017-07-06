/**
 * Created by dman on 02/07/2017.
 */
'use strict'
const moment = require('moment')

const apiGatewayService = new (require('../../services/api-gateway-service'))()
const authService = new (require('../../services/auth'))()
const userTokenRepository = new (require('../../repositories/user-token-repository'))()
const userTokenService = new (require('../../services/user-token-service'))(userTokenRepository)

module.exports = Object.freeze({
  createUser (email, claims) {
    return apiGatewayService.createApiCredential(email)
           .then(credentials => {
             claims.iss = credentials.key
             return authService.createToken(claims)
           })
  },

  createCredential (email) {
    return apiGatewayService
          .createApiCredential(email)
          .then(credentials => credentials)
  },

  createToken (email, claims) {
    let token = null
    return apiGatewayService
      .getUserApiCredential(email)
      .then(credentials => {
        claims.iss = credentials.data[0].key
        return authService.createToken(claims)
      })
      .then(_token => {
        token = _token
        const usertoken = {
          jti: claims.jti,
          email,
          expiry_date: moment.unix(claims.exp),
          issue_date: moment().toDate()
        }
        return userTokenService.createToken(usertoken)
      })
      .then((userToken) => token)
  },

  deleteUser (email) {
    return apiGatewayService
      .deleteUserApiCredential(email)
      .then(result => result)
  },

  deleteAllUserTokens (email) {
    return userTokenService
  .findByEmail(email)
  .then(tokens => tokens ? tokens.map(token => token.jti) : null)
  .then(jtis => userTokenService.deleteAllByJti(jtis))
  },

  deleteSingleToken (jti) {
    return userTokenService
      .deleteByJti(jti)
      .then(result => {})
  },

  verifyToken (token) {
    let decodedToken
    return authService
      .verify(token)
      .then(_decodedToken => {
        decodedToken = _decodedToken
        return userTokenService.checkValidity(decodedToken.jti)
      })
      .then(result => decodedToken)
  }

})
