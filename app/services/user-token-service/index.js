/**
 * Created by dman on 25/06/2017.
 */
'use strict'
const moment = require('moment')

const BaseRepository = require('qute-bookshelf-repository')
const UserToken = require('../../models/user-token')
const UserTokenRepository = require('../../repositories/user-token-repository')
const CommonErrors = require('quantal-errors')
const AppErrors = require('../../exceptions')

class UserTokenService {
  constructor (userTokenRepo) {
    if (!(userTokenRepo instanceof UserTokenRepository)) { throw new CommonErrors.IllegalArgumentError('repository must be instanceof UserTokenRepository') }

    this.userTokenRepo = userTokenRepo
  }

  createToken (claims) {
    if (!claims) { throw new CommonErrors.NullReferenceError('claims must not be null') }
    return this.userTokenRepo.create(claims)
  }

  checkValidity (jti) {
    return this.findByJti(jti)
     .then(token => {
       if (token) {
         const isExpired = moment(token.expiryDate).isBefore(moment())
         if (isExpired) {
           throw new AppErrors.TokenVerificationError('token verification failed')
         }
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
