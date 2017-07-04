/**
 * Created by dman on 02/07/2017.
 */
const bookshelf = require('../../app/db')
const knex = bookshelf.knex
const CommonErrors = require('quantal-errors')
module.exports = {
  cleanTables (tables) {
    if (!(tables instanceof Array)) { throw new CommonErrors.IllegalArgumentError('tables must be an array') }
    const sql = tables.map((table) => `DELETE FROM ${table}`).join(';')
    return knex.raw(sql)
  }
}
