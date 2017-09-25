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

const Wove = require('aspect.js').Wove
@Wove({ bar: 42 })
class ApiGatewayService {
  constructor (options) {
    this._apiGatewayEndpoint = options ? options.apiGatewayEndpoint : process.env.API_GATEWAY_ENDPOINT || null

    hoek.assert(this._apiGatewayEndpoint, new Errors.NullReferenceError('api gateway endpoint cannot be null or empty'))
  }

  createApiCredential (userId) {
    logger.info({userid: userId}, 'creating api credentials for user %s', userId)

    if (!userId) {
      const err = new Errors.NullReferenceError('user id / email cannot be null or empty')
      logger.error(err)
      return Promise.reject(err)
    }

    const endponint = `${this._apiGatewayEndpoint}${constants.JWT_CREDENTIAL_URL(userId)}`
    return axios.post(endponint, {}, {headers: {'content-type': 'application/json'}})
      .then((response) => {
        logger.info(response.data, 'credentials created successfully for user identified by %s', userId)
        return response.data
      })
      .catch(function (error) {
        logger.error(error)
        return Promise.reject(error)
      })
  }

  getUserApiCredential (userId) {
    logger.info({userid: userId}, 'requesting api credentials for user %s from api gateway', userId)

    if (!userId) {
      const err = new Errors.NullReferenceError('user id / email cannot be null or empty')
      logger.error(err)
      return Promise.reject(err)
    }

    const endponint = `${this._apiGatewayEndpoint}${constants.JWT_CREDENTIAL_URL(userId)}`
    return axios.get(endponint, null, {headers: {'content-type': 'application/json'}})
      .then((response) => {
        logger.info(response.data, 'credentials retrieved successfully for user identified by %s', userId)
        return response.data
      })
      .catch(function (error) {
        logger.error(error)
        return Promise.reject(error)
      })
  }

  /**
   * Deletes user api credential
   * @param userId
   * @returns {*}
   */
  deleteUserApiCredential (userId) {
    logger.info({userid: userId}, 'deleting api credentials for user %s from api gateway', userId)

    if (!userId) {
      const err = new Errors.NullReferenceError('user id / email cannot be null or empty')
      logger.error(err)
      return Promise.reject(err)
    }

    const endponint = `${this._apiGatewayEndpoint}${constants.CONSUMERS_URL}/${userId}`
    return axios.delete(endponint, null, {headers: {'content-type': 'application/json'}})
            .then((response) => {
              logger.info({data: response.data}, 'credentials deleted successfully for user identified by %s', userId)
              return response.data
            })
            .catch(function (error) {
              logger.error(error)
              return Promise.reject(error)
            })
  }
}

module.exports = ApiGatewayService
