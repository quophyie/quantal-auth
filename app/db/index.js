'use strict'

const knexfile = require('./../../knexfile')
const db = process.env.NODE_ENV ? knexfile[process.env.NODE_ENV.toLowerCase()] : knexfile.development
const knex = require('knex')(db)
const bookshelf = require('bookshelf')(knex)
// const cascadeDelete = require('bookshelf-cascade-delete')
const modelBase = require('bookshelf-modelbase').pluggable

// Registry: Register models in a central location so that you can refer to them using a string in relations instead of having to
// require it every time.
// Virtuals: Define virtual properties on your model to compute new values.
// Visibility: Specify a whitelist/blacklist of model attributes when serialized toJSON.
// Pagination: Adds fetchPage methods to use for pagination in place of fetch and fetchAll.
// bookshelf-camelcase: Simple bookshelf plugin that converts gets to camelCase and sets to snake_case
// bookshelf-cascade-delete: This Bookshelf.js plugin provides cascade delete with a simple configuration on your models.

bookshelf.plugin(['registry', 'visibility', 'pagination', 'virtuals', 'bookshelf-camelcase'/* , cascadeDelete */, modelBase])

module.exports = bookshelf
