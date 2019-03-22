/**
 * Created by dman on 24/06/2017.
 */
'use strict'
const _logger = require('../../logger/index').logger
const jwt = require('jsonwebtoken')
const authErrors = require('../../exceptions')
const Errors = require('quantal-errors')
const uuid4 = require('uuid/v4')
const moment = require('moment')
const Events = require('../../events')

class Auth {
  /**
   *
   * @param {object} options - the options
   * @param {Logger} options.logger - the logger used for logging
   */
  constructor (options) {
    this._jwtSecret = process.env.JWT_SECRET || 'secret'
    this.logger = (options && options.logger) || _logger
  }

  /**
   * Returs the logger
   * @returns {Logger|*}
   */
  getLogger () {
    return this.logger
  }

  /**
   * Creates a token
   * @param {object} claims - The jwt claims
   * @returns {Promise}
   */
  createToken (claims) {
    return new Promise((resolve, reject) => {
      this.logger.info({subEvent: Events.TOKEN_CREATE}, 'creating token ...')
      if (!claims) {
        const payloadErr = new authErrors.PayloadError('claims cannot be null or undefined')
        this.logger.error(payloadErr)
        return reject(payloadErr)
      }
      claims.jti = uuid4()
      // Convert expiry and not before to seconds
      claims.exp = claims.exp ? claims.exp : moment().add(moment.duration(2, 'hours')).toDate().getTime() / 1000
      claims.nbf = claims.nbf ? claims.nbf : moment().toDate().getTime() / 1000
      jwt.sign(claims, this._jwtSecret, (err, token) => {
        if (err) {
          const payloadErr = new authErrors.PayloadError(err)
          this.logger.error({subEvent: Events.TOKEN_CREATE}, payloadErr)
          return reject(payloadErr)
        }
        this.logger.info({subEvent: Events.TOKEN_CREATE}, 'token created successfully ...')
        return resolve({token})
      })
    })
  }

  /**
   * Verifies and decodes a token
   * @param {string} token - The token to be decoded
   * @returns {Promise}
   */
  verify (token) {
    this.logger.info({subEvent: Events.TOKEN_VERIFY}, 'verifying token')
    if (!token) {
      const err = new Errors.NullReferenceError('token is null. token cannot be null or empty')
      this.logger.error(err)
      return Promise.reject(err)
    }
    return new Promise((resolve, reject) => {
      jwt.verify(token, this._jwtSecret, (err, decoded) => {
        if (err) {
          this.logger.error({subEvent: Events.TOKEN_VERIFY}, err)
          return reject(err)
        }
        this.logger.info({subEvent: Events.TOKEN_VERIFY}, 'token verified successfully')
        return resolve(decoded)
      })
    })
  }
}

module.exports = Auth
