/**
 * Created by dman on 23/09/2017.
 */
'use strict'
const userCredentialController = require('../controllers/user/credential')
const userTokenController = require('../controllers/user/token')

module.exports = (router) => {

  userCredentialController(router);
  userTokenController(router);

}