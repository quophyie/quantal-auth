/**
 * Created by dman on 24/06/2017.
 */
'use strict'
const Code = require('code')
const expect = Code.expect
const ApiGatewayService = require('../../app/services/api-gateway-service/index')
const Errors = require('quantal-errors')
const constants = require('../../app/constants/index')
const nock = require('nock')

const apiGatewayEndpoint = 'http://localhost:8000'
const userEmail = 'user@quantal.com'
const userApiCredential = {
  consumer_id: '7bce93e1-0a90-489c-c887-d385545f8f4b',
  created_at: 1442426001000,
  id: 'bcbfb45d-e391-42bf-c2ed-94e32946753a',
  key: 'a36c3049b36249a3c9f8891cb127243c',
  secret: 'e71829c351aa4242c2719cbfbe671c09'
}

describe('Api Gateway Service Tests', () => {
  let apiService

  beforeEach(() => {
    apiService = new ApiGatewayService({apiGatewayEndpoint})
    nock(apiGatewayEndpoint)
      .post(constants.JWT_CREDENTIAL_URL(userEmail))
      .reply(200, userApiCredential)
      .get(constants.JWT_CREDENTIAL_URL(userEmail))
      .reply(200, userApiCredential)
      .delete(constants.JWT_CREDENTIAL_URL(userEmail))
      .reply(200, userApiCredential)

  })

  it('should throw NullReferenceException on create ApiGatewayService given null / empty apiGatewayEndpoint', () => {
    process.env.API_GATEWAY_ENDPOINT = ''
    const thrown = () => { return new ApiGatewayService() }
    expect(thrown).to.throw(Errors.NullReferenceError, 'api gateway endpoint cannot be null or empty')
  })

  it('should throw NullReferenceException on create user api credential given null or empty user id', () => {
    return apiService.createApiCredential()
      .catch(err => expect(err).to.be.instanceof(Errors.NullReferenceError))
  })

  it('should  create api gateway credentials for user ', () => {
    return apiService
      .createApiCredential(userEmail)
      .then(result => expect(result).to.be.equal(userApiCredential))
  })

  it('should throw NullReferenceException on create user api credential given null or empty user id', () => {
    return apiService.getUserApiCredential()
      .catch(err => expect(err).to.be.instanceof(Errors.NullReferenceError))
  })

  it('should return api gateway credentials given user email / id ', () => {
    return apiService
      .getUserApiCredential(userEmail)
      .then(result => expect(result).to.be.equal(userApiCredential))
  })

  it('should delete user credentials on api gateway credentials given user email / id ', () => {
    return apiService
            .deleteUserApiCredential(userEmail)
            .then(result => expect(result).to.be.equal(userApiCredential))
  })
})
