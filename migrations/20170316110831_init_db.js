'use strict'

exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('usertokens', (table) => {
      table.increments()
      table.string('email', 128)
      table.string('jti').unique()
      table.timestamp('issue_date').defaultTo(knex.fn.now())
      table.timestamp('expiry_date').defaultTo(knex.fn.now())
      table.timestamps()
      // table.timestamps(true, true)
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('usertokens')
  ])
}