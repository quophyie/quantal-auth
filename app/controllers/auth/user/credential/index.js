/**
 * Created by dman on 03/07/2017.
 */
'use strict'
const userTokenFacade = require('../../../../facades/user-token-facade/index')
const Joi = require('joi')
const expressJoi = require('express-joi-validator')

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

const idOrEmailSchema = Joi.alternatives().try(emailSchema, idSchema)

module.exports = (router) => {
  /**
   * creates new credentials for the user identified by the given email
   */
  router.post('/',
    expressJoi(idOrEmailSchema),
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
    expressJoi(emailSchema),
    (req, res, next) => {
      const idOrEmail = req.params['email']
      userTokenFacade.deleteUser(idOrEmail)
      .then(result => res.json())
      .catch(next)
    })
}
