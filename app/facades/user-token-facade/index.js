/**
 * Created by dman on 02/07/2017.
 */
'use strict'
const moment = require('moment')
const jwtDecode = require('jwt-decode')
const _ = require('lodash')
const CommonErrors = require('quantal-errors')
const Errors = require('../../exceptions')

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

/*  createToken (email, claims) {
    let token = null
    return apiGatewayService
      .getUserApiCredential(email)
      .then(credentials => {
        if (!claims) claims = {}
        claims.iss = credentials.data[0].key
        const secret = credentials.data[0].secret
        return authService.createToken(claims, secret)
      })
      .then(_token => {
        token = _token
        const usertoken = {
          jti: claims.jti,
          email,
          expiry_date: moment.unix(claims.exp),
          issue_date: moment().toDate()
        }
        // We store the tokens in the db so that we can at a later date blacklist a
        // compromised / invalid token. For example if a user logs out of an application,
        // the token that they had previously used becomes invalid for
        // later use and hence should be blacklisted.
        // However, if we dont keep track of blacklisted tokens, there will be no way
        // to stop an attacker from using the logged out / invalidated token. This is
        // because kong does not know of blacklisted tokens. Kong only verifies signed tokens
        // Bear in mind that Kong does not keep track of black listed tokens
        // Kong can only verify the signed tokens
        // See https://stackoverflow.com/questions/21978658/invalidating-json-web-tokens for more info
        return userTokenService.createToken(usertoken)
      })
      .then((userToken) => token)
  } */
  createToken (email, claims) {
    return apiGatewayService
      .getUserApiCredential(email)
      .then(credentials => {
        if (!claims) claims = {}
        claims.iss = credentials.data[0].key
        const secret = credentials.data[0].secret
        return authService.createToken(claims, secret)
      })
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

  blacklistAllUserTokens (email) {
    return apiGatewayService.getUserApiCredential(email)
      .then(credentials => apiGatewayService.deleteUserApiCredential(email, credentials.data[0].id))
      .then(res => apiGatewayService.createApiCredential(email))
  },

  blacklistToken (email, token) {
    if (token) {
      const decodedToken = jwtDecode(token)
      if (decodedToken) {
        const jti = decodedToken.jti
        const usertoken = {
          jti: jti,
          email,
          expiry_date: moment.unix(decodedToken.exp),
          issue_date: moment.unix(decodedToken.iat)
        }

        return userTokenService.upsert({jti}, usertoken)
      } else {
        throw new Errors.InvalidTokenError('Invalid JWT')
      }
    }
  },

  tokenBlacklistCheck (requestData) {
    let blacklistCheckResult = {}
    if (_.has(requestData, ['headers', 'authorization']) ||
      _.has(requestData, ['uri_args', 'jwt'])) {
      let decodedToken
      if (_.has(requestData, ['headers', 'authorization'])) {
        decodedToken = jwtDecode(requestData.headers.authorization.split(' ')[1])
      } else if (_.has(requestData, ['uri_args', 'jwt'])) {
        decodedToken = jwtDecode(requestData.uri_args.jwt)
      }

      return userTokenService.findByJti(decodedToken.jti)
        .then(token => {
          return token !== null && token !== undefined
        })
        .then(isBlacklisted => {
          if (!isBlacklisted) {
            blacklistCheckResult = { message: 'JWT is blacklisted or invalid. FAIL' }
          } else {
            blacklistCheckResult = {message: `Not blacklisted. OK`}
          }
          return blacklistCheckResult
        })
        .catch(err => {
          if (err instanceof CommonErrors.NotFoundError) {
            blacklistCheckResult = {message: 'JWT is blacklisted or invalid. FAIL'}
            throw new Errors.TokenVerificationError('JWT is blacklisted or invalid. FAIL')
          }
          throw err
        })
    } else {
      blacklistCheckResult = {message: 'No JWT. No blacklist check. OK'}
      return Promise.resolve(blacklistCheckResult)
    }
  },

  verifyToken (userIdOrEmail, token) {
    let decodedToken
    return apiGatewayService.getUserApiCredential(userIdOrEmail)
      .then(credentials => authService.verify(token, credentials.data[0].secret))
      .then(_decodedToken => {
        decodedToken = _decodedToken
        return userTokenService.checkValidity(decodedToken.jti)
      })
      .then(result => decodedToken)
  }

})
