/**
 * Created by dman on 25/09/2017.
 */

 import {beforeMethod} from 'aspect.js'
// const beforeMethod = require('aspect.js').beforeMethod
 class AppAspect {
   @beforeMethod({
     classNamePattern: /SomeClass/,
     methodNamePattern: /(someMethod|SomeOtherNethod)/
   })
  invokeBeforeMethod (meta) {
    console.log(`Inside of the logger. Called ${meta.className}.${meta.method.name} with args: ${meta.method.args.join(', ')}.`)
  }
}

 module.exports = AppAspect
