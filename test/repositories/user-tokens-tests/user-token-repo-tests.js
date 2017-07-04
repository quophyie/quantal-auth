/**
 * Created by dman on 28/06/2017.
 */
'use strict'
const Code = require('code')
const expect = Code.expect
const UserTokenRepository = require('../../../app/repositories/user-token-repository')
const UserTokenModel = require('../../../app/models/user-token')
const util = require('../../util')
let userTokensRepo = null
const jti = 'user1_jti'
const userTokenData = {
  id: 1,
  jti: jti,
  email: 'user1@quantal.com'
}

const userTokenData2 = {
  id: 2,
  jti: `${jti}2`,
  email: 'user2@quantal.com'
}

describe('UserToken Repo Tests', () => {
  beforeEach((done) => {
    userTokensRepo = new UserTokenRepository()

    util.cleanTables(['usertokens'])
             .then(() => {
               return Promise.all([
                 UserTokenModel.forge().save(userTokenData, {method: 'insert', require: true}),
                 UserTokenModel.forge().save(userTokenData2, {method: 'insert', require: true})
               ])
             })

            .then((model) => {
              done()
            })
             .catch(done)
  })
  it(`should return token specified by  ${jti}`, () => {
    return userTokensRepo
            .findByJti(jti)
            .then(token => {
              expect(token).to.be.an.object()
              expect(token.toJSON().jti).to.be.an.equal(jti)
            })
  })

  it(`should delete token specified by  ${jti}`, () => {
    return userTokensRepo
            .deleteByJti(jti)
            .then(deleted => {
              expect(deleted).to.be.an.object()
            })
  })

  it(`should delete all tokens specified by  given jtis`, () => {
    return userTokensRepo
            .deleteAllByJtis([jti, userTokenData2.jti])
            .then(deleted => {
              expect(deleted).to.be.an.array()
            })
  })
})
