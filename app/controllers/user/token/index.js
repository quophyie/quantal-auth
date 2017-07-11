'use strict'
const parseToken = require('parse-bearer-token')
const userTokenFacade = require('../../../facades/user-token-facade/index')

const Joi = require('joi')
const Celebrate = require('celebrate')

const bodyEmailSchema = {
  body: {
    email: Joi.string().email()
  }
}

const bodyIdSchema = {
  body: {
    userId: Joi.number()
  }
}

const bodyIdOrEmailSchema = {
  body:
  {
    email: Joi.alternatives().try(bodyEmailSchema.body.email, bodyIdSchema.body.userId),
    id: Joi.alternatives().try(bodyEmailSchema.body.email, bodyIdSchema.body.userId),
    claims: Joi.object()
  }
}

const bodyTokenOrHeaderTokenSchema = {
  headers: {

    authorization: Joi.string()
  },
  body: {
    token: Joi.string()
  }
}// .or('headers', 'body')

const paramsEmailSchema = {
  params: {
    email: Joi.string().email()
  }
}

const paramsJtiSchema = {
  params: {
    jti: Joi.string().guid({
      version: [
        'uuidv4'
      ]
    })
  }
}

module.exports = (router) => {
  router.post('/',
    Celebrate(bodyIdOrEmailSchema, { stripUnknown: true }),
    (req, res, next) => {
      const idOrEmail = req.body['emailOrId'] || req.body['email']
      const claims = req.body.claims
      userTokenFacade.createToken(idOrEmail, claims)
      .then(result => res.json(result))
      .catch(next)
    })

  /**
   * Delete all user tokens given the email of the user.
   */
  router.delete('/:email',
    Celebrate(paramsEmailSchema, { stripUnknown: true }),
    (req, res, next) => {
      const idOrEmail = req.params['email']
      userTokenFacade.deleteAllUserTokens(idOrEmail)
      .then(result => res.json(result))
      .catch(next)
    })

  /**
   * Deletes a single token given the jti (jwt id) of the  token.
   */
  router.delete('/one/:jti',
    Celebrate(paramsJtiSchema, { stripUnknown: true }),
    (req, res, next) => {
      const idOrEmail = req.params['jti']
      userTokenFacade.deleteSingleToken(idOrEmail)
      .then(result => res.json(result))
      .catch(next)
    })

  /**
   * Verifies the token
   */
  router.post('/verify',
    Celebrate(bodyTokenOrHeaderTokenSchema, { stripUnknown: true }),
    (req, res, next) => {
      const token = parseToken(req) || req.body.token
      userTokenFacade.verifyToken(token)
      .then(decoded => res.json(decoded))
      .catch(next)
    })
}
