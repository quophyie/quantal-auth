/**
 * Created by dman on 02/07/2017.
 */

'use strict'
const Code = require('code')
const expect = Code.expect
const UserTokenRepository = require('../../app/repositories/user-token-repository')
const UserTokenService = require('../../app/services/user-token-service')
const UserTokenModel = require('../../app/models/user-token')
const CommonErrors = require('quantal-errors')
const sinon = require('sinon')

const userTokenRepository = new UserTokenRepository(UserTokenModel)

const util = require('../util')
const jti = 'user_jti'
const userToken = {
  id: 1,
  jti: jti,
  email: 'user1@quantal.com'
}

let userTokenService = null

describe('UserTokenService', () => {
  beforeEach(() => {
    userTokenService = new UserTokenService(userTokenRepository)
  })

  it('Should throw IllegalArgumentError given null UserTokenRepository on create UserServiceRepository', () => {
    const thrown = () => new UserTokenService(null)
    expect(thrown).to.throw(CommonErrors.IllegalArgumentError, 'repository must be instanceof UserTokenRepository')
  })

  it('should return user token when findByJti is called', () => {
    const stub = sinon.stub(userTokenRepository, 'findByJti', () => Promise.resolve(userToken))
    stub(Promise.resolve(userToken))
    return userTokenService
            .findByJti(jti)
            .then(token => {
              expect(token).to.be.an.object()
              expect(token.jti).to.be.equal(jti)
            })
            .catch(() => stub.restore())
            .then(() => stub.restore())
  })

  it('should return user token when findById is called with user id', () => {
    const stub = sinon.stub(userTokenRepository, 'findById', () => Promise.resolve(userToken))
    stub(Promise.resolve(userToken))
    return userTokenService
            .findById(1)
            .then(token => {
              expect(token).to.be.an.object()
              expect(token.id).to.be.equal(1)
            })
            .catch(() => stub.restore())
            .then(() => stub.restore())
  })

  it('should return user token when findByEmail is called with user email', () => {
    const stub = sinon.stub(userTokenRepository, 'findOne', () => Promise.resolve(userToken))
    const email = 'user1@quantal.com'
    stub(Promise.resolve(userToken))
    return userTokenService
            .findByEmail(email)
            .then(token => {
              expect(token).to.be.an.object()
              expect(token.email).to.be.equal(email)
            })
            .catch(() => stub.restore())
            .then(() => stub.restore())
  })

  it('should delete single token given jti', () => {
    const stub = sinon.stub(userTokenRepository, 'deleteByJti', () => Promise.resolve(userToken))
    stub(Promise.resolve(userToken))
    return userTokenService
            .deleteByJti(jti)
            .then(result => {
              expect(result).to.be.an.object()
            })
            .catch(() => stub.restore())
            .then(() => stub.restore())
  })

  it('should delete all using jtis', () => {
    const stub = sinon.stub(userTokenRepository, 'deleteAllByJtis', () => Promise.resolve([userToken]))
    const email = ['jti_1', 'jti_2']
    stub(Promise.resolve(userToken))
    return userTokenService
            .deleteAllByJti(email)
            .then(token => {
              expect(token).to.be.an.object()
              expect(token.email).to.be.an.array()
            })
            .catch(() => stub.restore())
            .then(() => stub.restore())
  })
})
