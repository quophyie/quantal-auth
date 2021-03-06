/**
 * Created by dman on 24/06/2017.
 */
'use strict'
const Errors = require('quantal-errors')
const AppErrs = require('../../exceptions')
const hoek = require('hoek')
const axios = require('axios')
const logger = require('../../logger/index').logger
const constants = require('../../constants/index')
const Wove = require('aspect.js').Wove()
const Events = require('../../events')

@Wove
class ApiGatewayService {
  constructor (options) {
    this._apiGatewayEndpoint = options ? options.apiGatewayEndpoint : process.env.API_GATEWAY_ENDPOINT || null

    hoek.assert(this._apiGatewayEndpoint, new Errors.NullReferenceError('api gateway endpoint cannot be null or empty'))
  }

  createApiCredential (userId) {
    logger.info({subEvent: Events.CREDENTIALS_CREATE}, 'creating api credentials for user %s', userId)

    if (!userId) {
      const err = new Errors.NullReferenceError('user id / email cannot be null or empty')
      logger.error({subEvent: Events.CREDENTIALS_CREATE}, err)
      return Promise.reject(err)
    }

    const endponint = `${this._apiGatewayEndpoint}${constants.JWT_CREDENTIAL_URL(userId)}`
    return axios.post(endponint, {}, {headers: {'content-type': 'application/json'}})
      .then((response) => {
        logger.info({subEvent: Events.CREDENTIALS_CREATE, data: response.data}, 'credentials created successfully for user identified by %s', userId)
        return response.data
      })
      .catch(function (error) {
        logger.error({subEvent: Events.CREDENTIALS_CREATE}, error)
        return Promise.reject(error)
      })
  }

  getUserApiCredential (userId) {
    logger.info({subEvent: Events.CREDENTIALS_REQUEST}, 'requesting api credentials for user %s from api gateway', userId)

    if (!userId) {
      const err = new Errors.NullReferenceError('user id / email cannot be null or empty')
      logger.error({subEvent: Events.CREDENTIALS_REQUEST}, err)
      return Promise.reject(err)
    }

    const endponint = `${this._apiGatewayEndpoint}${constants.JWT_CREDENTIAL_URL(userId)}`
    return axios.get(endponint, null, {headers: {'content-type': 'application/json'}})
      .then((response) => {
        logger.info({data: response.data, subEvent: Events.CREDENTIALS_RECEIVED}, 'credentials retrieved successfully for user identified by %s', userId)
        return response.data
      })
      .catch(function (error) {
        logger.error({subEvent: Events.CREDENTIALS_REQUEST}, error)
        return Promise.reject(error)
      })
  }

  /**
   * Deletes user api credential
   * @param userId
   * @param jwtCredentialId - the jwt credential id
   * @returns {*}
   */
  deleteUserApiCredential (userId, jwtCredentialId) {
    logger.info({subEvent: Events.CREDENTIALS_DELETE}, 'deleting api credentials for user %s from api gateway', userId)

    if (!userId) {
      const err = new Errors.NullReferenceError('user id / email cannot be null or empty')
      logger.error({subEvent: Events.CREDENTIALS_DELETE}, err)
      return Promise.reject(err)
    }

    const endponint = `${this._apiGatewayEndpoint}${constants.JWT_CREDENTIAL_URL(userId)}/${jwtCredentialId}`
    return axios.delete(endponint, null, {headers: {'content-type': 'application/json'}})
            .then((response) => {
              logger.info({subEvent: Events.CREDENTIALS_DELETE, data: response.data}, 'credentials deleted successfully for user identified by %s', userId)
              return response.data
            })
            .catch(function (error) {
              logger.error({subEvent: Events.CREDENTIALS_DELETE}, error)
              return Promise.reject(error)
            })
  }

  /**
   * Deletes user (consumer) on the api gateway i.e.  Kong
   * @param userId - the email or user id  of the user to be deleted
   * @param jwtCredentialId - the jwt credential id
   * @returns {*}
   */
  deleteUseFromApiGateway (userId, jwtCredentialId) {
    logger.info({subEvent: Events.API_CONSUMER_DELETE}, 'deleting consumer (i.e. user) %s from api gateway', userId)

    if (!userId) {
      const err = new Errors.NullReferenceError('user id / email cannot be null or empty')
      logger.error({subEvent: Events.API_CONSUMER_DELETE}, err)
      return Promise.reject(err)
    }

    const endponint = `${this._apiGatewayEndpoint}${constants.CONSUMERS_URL}/${userId}`
    return axios.delete(endponint, null, {headers: {'content-type': 'application/json'}})
      .then((response) => {
        logger.info({subEvent: Events.API_CONSUMER_DELETE, data: response.data}, 'consumer (i.e. user) successfully for user identified by %s', userId)
        return response.data
      })
      .catch(function (error) {
        logger.error({subEvent: Events.API_CONSUMER_DELETE}, error)
        return Promise.reject(error)
      })
  }
}

module.exports = ApiGatewayService
