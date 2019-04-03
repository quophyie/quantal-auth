'use strict'
const createError = require('create-error')
const jwt = require('jsonwebtoken')
module.exports = Object.freeze({
  PayloadError: createError('PayloadError'),
  TokenVerificationError: createError('TokenVerificationError'),
  InvalidTokenError: createError('InvalidTokenError'),
  TokenExpiredError: jwt.TokenExpiredError,
  NotBeforeError: jwt.NotBeforeError,
  JsonWebTokenError: jwt.JsonWebTokenError
})
