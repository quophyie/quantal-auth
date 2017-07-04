/**
 * Created by dman on 02/07/2017.
 */
'use strict'

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

  createToken (email, claims) {
    return apiGatewayService
          .getUserApiCredential(email)
          .then(credentials => {
            claims.iss = credentials.key
            return authService.createToken(claims)
          })
  },

  deleteUser (email) {

  }
})
