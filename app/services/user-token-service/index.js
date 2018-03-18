/**
 * Created by dman on 25/06/2017.
 */
'use strict'
const moment = require('moment')
const _logger = require('../../logger/index').logger

const BaseRepository = require('qute-bookshelf-repository')
const UserToken = require('../../models/user-token')
const UserTokenRepository = require('../../repositories/user-token-repository')
const CommonErrors = require('quantal-errors')
const AppErrors = require('../../exceptions')
const Events = require('../../events')

class UserTokenService {
  constructor (userTokenRepo) {
    if (!(userTokenRepo instanceof UserTokenRepository)) { throw new CommonErrors.IllegalArgumentError('repository must be instanceof UserTokenRepository') }
    this.userTokenRepo = userTokenRepo
    this.logger = _logger
  }

  createToken (claims) {
    if (!claims) { throw new CommonErrors.NullReferenceError('claims must not be null') }
    return this.userTokenRepo.create(claims)
  }

  checkValidity (jti) {
    this.logger.info({subEvent: Events.TOKEN_VALIDATE}, 'validating token ...')
    return this.findByJti(jti)
     .then(token => {
       if (token) {
         const isExpired = moment(token.expiryDate).isBefore(moment())
         if (isExpired) {
           this.logger.info({subEvent: Events.TOKEN_VALIDATE}, 'token failed validation')
           throw new AppErrors.TokenVerificationError('token verification failed')
         }
         this.logger.info({subEvent: Events.TOKEN_VALIDATE}, 'token successfully validated')
         return isExpired
       }
     })
  }

  findByJti (jti) {
    return this.userTokenRepo.findByJti(jti)
  }

  findById (id) {
    return this.userTokenRepo.findById(id)
  }

  findByEmail (email) {
    return this.userTokenRepo.findOne({email: email})
  }

  deleteByJti (jti) {
    return this.userTokenRepo.deleteByJti(jti)
  }

  deleteAllByJti (jtis) {
    return this.userTokenRepo.deleteAllByJtis(jtis)
  }
}

module.exports = UserTokenService
