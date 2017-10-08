/**
 * Created by dman on 24/06/2017.
 */
'use strict'
const Logger = require('quant-beat').logger
const loggerExpress = require('quant-beat').loggerExpress
const err = require('quantal-nodejs-shared').serializers.err
const opts = {
  serializers: { err }
}

module.exports = {

  logger: new Logger(opts),
  loggerExpress
}
