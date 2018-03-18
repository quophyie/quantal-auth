/**
 * Created by dman on 05/10/2017.
 */
'use strict'

const CommonEvents = require('quantal-nodejs-shared').events

const events = Object.assign({}, CommonEvents)
events.CREDENTIALS_REQUEST = 'CREDENTIALS_REQUEST'
events.CREDENTIALS_RECEIVED = 'CREDENTIALS_RECEIVED'
events.CREDENTIALS_CREATE = 'CREDENTIALS_CREATE'
events.CREDENTIALS_DELETE = 'CREDENTIALS_DELETE'
events.CREDENTIALS_VERIFY = 'CREDENTIALS_VERIFY'
events.TOKEN_CREATE = 'TOKEN_CREATE'
events.TOKEN_VERIFY = 'TOKEN_VERIFY'
events.TOKEN_VALIDATE = 'TOKEN_VALIDATE'
events.TOKENEXPIREDERROR = 'TOKENEXPIREDERROR'

module.exports = Object.freeze(events)
