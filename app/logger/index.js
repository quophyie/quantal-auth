/**
 * Created by dman on 24/06/2017.
 */
'use strict'
const Logger = require('quant-beat').logger
const loggerExpress = require('quant-beat').loggerExpress
const err = require('quantal-nodejs-shared').serializers.err
const opts = {
  serializers: { err },
  logzioOpts: {
    token: process.env.LOGZIO_TOKEN
  }
}

module.exports = {

  logger: new Logger(opts),
  loggerExpress
}
