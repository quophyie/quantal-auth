/**
 * Created by dman on 29/06/2017.
 */
'use strict'
const UserToken = require('../../models/user-token')
const BaseRepository = require('qute-bookshelf-repository')
const Bookshelf = require('bookshelf')(null)
const CommonErrors = require('quantal-errors')

class UserTokenRepository extends BaseRepository {
  constructor () {
    super(UserToken)
  }

  findByJti (jti) {
    return UserToken.findByJti(jti)
            .catch(Bookshelf.NotFoundError, () => Promise.reject(new CommonErrors.NotFoundError('NotFoundError')))
            .catch(Bookshelf.EmptyError, () => Promise.reject(new CommonErrors.NotFoundError('NotFoundError')))
            .catch(err => Promise.reject(CommonErrors.utils.bookshelfToApp(err)))
  }

  deleteByJti (jti) {
    return UserToken.deleteByJti(jti)
            .catch(Bookshelf.NotFoundError, () => Promise.reject(new CommonErrors.NotFoundError('NotFoundError')))
            .catch(Bookshelf.EmptyError, () => Promise.reject(new CommonErrors.NotFoundError('NotFoundError')))
            .catch(err => Promise.reject(CommonErrors.utils.bookshelfToApp(err)))
  }

  deleteAllByJtis (jtis) {
    return UserToken.deleteAllByJtis(jtis)
            .catch(Bookshelf.NotFoundError, () => Promise.reject(new CommonErrors.NotFoundError('NotFoundError')))
            .catch(Bookshelf.EmptyError, () => Promise.reject(new CommonErrors.NotFoundError('NotFoundError')))
            .catch(err => Promise.reject(CommonErrors.utils.bookshelfToApp(err)))
  }
}

module.exports = UserTokenRepository
