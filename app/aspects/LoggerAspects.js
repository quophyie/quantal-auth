/**
 * Created by dman on 25/09/2017.
 */

 import {beforeMethod} from 'aspect.js'
// const beforeMethod = require('aspect.js').beforeMethod
 class LoggerAspects {
   @beforeMethod({
     classNamePattern: /Logger/,
     methodNamePattern: /(trace|debug|info|warn|error)/
   })
  invokeBeforeMethod (meta) {
    //  meta.woveMetadata == { bar: 42 }
    if (meta.method) {
      if (typeof (meta.method.args[0]) !== 'object') {
        meta.method.args = [{event: 'SOME_EVENT'}, ...meta.method.args]
      } else {
        meta.method.args[0].event = 'SOME_OTHER_EVENT'
      }
    }
    // console.log(`Inside of the logger. Called ${meta.className}.${meta.method.name} with args: ${meta.method.args.join(', ')}.`)
  }
}

 module.exports = LoggerAspects
