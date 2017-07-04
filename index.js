'use strict'

const initializer = new (require('./app/initializer'))()

module.exports = initializer.getApp()
