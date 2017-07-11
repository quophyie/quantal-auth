/**
 * Created by dman on 03/07/2017.
 */
'use strict'
const userTokenFacade = require('../../../facades/user-token-facade/index')
const Joi = require('joi')
const Celebrate = require('celebrate')

const emailSchema = {
  body: {
    email: Joi.string().email()
  }
}

const idSchema = {
  body: {
    userId: Joi.number()
  }
}

// const idOrEmailSchema = Joi.alternatives().try(emailSchema, idSchema)
const idOrEmailSchema = {
  body: {
    userId: Joi.number(),
    email: Joi.string().email()
  }
}

module.exports = (router) => {
  /**
   * creates new credentials for the user identified by the given email
   */
  router.post('/',
    Celebrate(idOrEmailSchema, {stripUnknown: true}),
    (req, res, next) => {
      const idOrEmail = req.body['userId'] || req.body['email']
      userTokenFacade.createCredential(idOrEmail)
            .then(result => res.json())
            .catch(next)
    })

  /**
   * Deletes the credetials of the given user using their email
   */
  router.delete('/:email',
    Celebrate(emailSchema, {stripUnknown: true}),
    (req, res, next) => {
      const idOrEmail = req.params['email']
      userTokenFacade.deleteUser(idOrEmail)
      .then(result => res.json())
      .catch(next)
    })
}
