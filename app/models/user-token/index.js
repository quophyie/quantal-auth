/**
 * Created by dman on 27/06/2017.
 */
'use strict'
const bookshelf = require('./../../db')
const ModelBase = require('bookshelf-modelbase')(bookshelf)
const Joi = require('joi') //eslint-disable-line

const UserToken = ModelBase.extend({
  tableName: 'usertokens'

    // validation is passed to Joi.object(), so use a raw object
    /* validate: {
     firstName: Joi.string()
     } */
}, {
  findByJti: require('./find-by-jti'),
  deleteByJti: require('./delete-by-jti'),
  deleteAllByJtis: require('./delete-all-by-jtis')
}
)

module.exports = bookshelf.model('UserToken', UserToken)
