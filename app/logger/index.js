/**
 * Created by dman on 24/06/2017.
 */
'use strict'
const Logger = require('quant-beat').logger
const loggerExpress = require('quant-beat').loggerExpress
module.exports = {

  logger: new Logger(), //{},/
  loggerExpress,
  lobObject: {
    event: 'SOME_EVENT'
  }
}
