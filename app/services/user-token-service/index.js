/**
 * Created by dman on 25/06/2017.
 */
'use strict'

const BaseRepository = require('qute-bookshelf-repository')
const UserToken = require('../../models/user-token')
const UserTokenRepository = require('../../repositories/user-token-repository')
const CommonErrors = require('quantal-errors')

class UserTokenService {
  constructor (userTokenRepo) {
    if (!(userTokenRepo instanceof UserTokenRepository)) { throw new CommonErrors.IllegalArgumentError('repository must be instanceof UserTokenRepository') }

    this.userTokenRepo = userTokenRepo
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
