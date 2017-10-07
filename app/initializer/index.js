'use strict'
/**
const sharedGlobals = require('./lib/shared-globals')
if (process.env.NODE_ENV !== 'test') {
  sharedGlobals.DB = Object.freeze(require('./../schemas/index')({
    DATABASE_URL: process.env.DATABASE_URL
  }))
} */
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const enrouten = require('express-enrouten')

const logger = require('../logger').logger
const loggerExpress = require('../logger').loggerExpress

const LoggerAspect = require('quantal-nodejs-shared').aspects.LoggerAspect
new LoggerAspect(logger, true, true)
const Events = require('../events')
const AppAspect = require('../aspects').AppAspect
new AppAspect()

const errorMiddleware = require('quantal-errors').expressErrorMiddleware
const mdcPopulatorMiddleware = require('quantal-nodejs-shared').middleware.MdcPopulator
const AppErrors = require('../exceptions')
const errorMappings = {
  unauthorized: ['TokenVerificationError', 'TokenExpiredError']
}

class Initializer {
  /**
   * Initializes and starts the microservice
   */
  constructor () {
    this.port = Number(process.env.PORT) ? process.env.PORT : 3000
    this.app = app

    this.app.use(cors())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(cookieParser())
    this.app.use(mdcPopulatorMiddleware(logger))
    this.app.use(loggerExpress(logger, { setSpringCloudSleuthHeaders: true }))
    this.app.use(enrouten({ directory: './../controllers/' }))

    this.app.listen(this.port, () => logger.getMdc().run(() => logger.info(Events.SERVICE_START, `Listening on port %s`, this.port)))
    /**
     * For example
     *
     * AppErrors = {
     *   MyCustomError: createError('MyCustomError')
     * }
     * errorMappings = {
     *   badRequest: ['MyCustomError']
     * }
     */
    this.app.use(errorMiddleware(AppErrors, errorMappings))
    // app.use(require('./error-middleware')(logger))
  }

  getApp () {
    return this.app
  }

  getPort () {
    return this.port
  }

  getRouter () {
    return this.router
  }
}

module.exports = Initializer
