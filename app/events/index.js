/**
 * Created by dman on 05/10/2017.
 */
'use strict'

const CommonEvents = require('quantal-nodejs-shared').events

const events = Object.assign({}, CommonEvents)
events.CREDENTIALS_REQUEST = 'CREDENTIALS_REQUEST'
events.CREDENTIALS_RECEIVED = 'CREDENTIALS_RECEIVED'
events.CREDENTIALS_CREATE = 'CREDENTIALS_CREATE'

module.exports = Object.freeze(events)
