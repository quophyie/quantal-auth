'use strict'
/**
 * Created by dman on 24/06/2017.
 */
const Code = require('code')
const expect = Code.expect
const Auth = require('../../app/services/auth')
const authErrors = require('../../app/exceptions')
const Errors = require('quantal-errors')
let auth = null

describe('Auth Tests', () => {
  beforeEach(() => {
    auth = new Auth()
  })

  it('should throw PayloadError Error given null claims', () => {
    return auth.createToken({name: 'auth'})
      .then(token => expect(token).to.be.a.string())
  })

  it('should create JWT', () => {
    return auth.createToken()
      .catch(err => expect(err).to.be.instanceof(authErrors.PayloadError))
  })

  it('should throw NullReferenceError given null or empty token on verify token', () => {
    return auth.verify()
      .catch(err => expect(err).to.be.instanceof(Errors.NullReferenceError))
  })

  it('should verify JWT', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYXV0aCIsImlhdCI6MTQ5ODMzODc5MH0.BHt07yxL7RDycuay3bupf_8KFYwpXfdHlU93GwVIQk0'
    return auth.verify(token)
      .then(result => expect(result).to.be.an.object())
  })
})
