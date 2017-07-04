'use strict'
const bookshelf = require('./../../db')
const ModelBase = require('bookshelf-modelbase')(bookshelf)
const Joi = require('joi') //eslint-disable-line

 /** class Giphy extends ModelBase {
  get tableName () {
    return 'giphys'
  }

  get idAttribute () {
    return 'giphy_id'
  }

  // validation is passed to Joi.object(), so use a raw object
  // Uncoment to apply validation on
  /* validate () {
    return {
      firstName: Joi.string()
    }
  } * /
} */

const Giphy = ModelBase.extend({
  tableName: 'giphys',
  idAttribute: 'giphy_id'

  // validation is passed to Joi.object(), so use a raw object
  /* validate: {
   firstName: Joi.string()
   } */
})

module.exports = bookshelf.model('Giphy', Giphy)
