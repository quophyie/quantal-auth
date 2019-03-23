# Node Microservice Template

A microservice template that uses [Bookshelf JS](http://bookshelfjs.org/ "BookShelfJS Homepage")
as the ORM framework 

#### Requirements:
- Nodejs (at least v6)
- npm

#### Running:
Install dependencies - `npm install`

Run the microservice using a command like

**`NODE_ENV=<NODE ENVIRONMENT> DB_TYPE=<DB TYPE> DB_NAME=<DB NAME> DB_USER=<DB USER> DB_PASSWORD=<DB PASSWORD> DB_HOST=<DB HOST> npm start`**

for example 

**`NODE_ENV=development DB_TYPE=postgresql DB_NAME=my_db DB_USER=postgres DB_PASSWORD=postgres DB_HOST=localhost npm start`**

##### Command line Properties
 - **`NODE_ENV`** - The environment e.g. **`development`**,  **`staging`**,  **`production`**,  **`test`**

 - **`DB_TYPE`** - The database type \ dialect i.e.  **`postgresql`**,  **`mysql`**,  **`mariasql`**,  **`sqlite`**.
     See [Bookshelf JS Installation](http://bookshelfjs.org/#installation "BookShelfJS Installation")
 
 - **`DB_NAME`** - The database name  e.g. **`my_db`**
 
 - **`DB_USER`** - The database username  e.g. **`postgres`**
 
 - **`DB_PASSWORD`** - The database username  e.g. **`postgres`**
 
 - **`DB_HOST`** - The database host ip or name  e.g. **`localhost`**
 
 - **`LOGZIO_TOKEN`** - The [Logz.io](http://logz.io) token to use to send logs to [Logz.io](http://logz.io)
 
 - **`API_GATEWAY_ENDPOINT`** - The endpoint for the API Gateway e.g. [http://localhost:8001](http://localhost:8001)

#### Code

##### Repositories
Bookshelf repository classes that extend **`quantal-nodejs-bookshelf-base-repository`** must call the 
constructor of **`quantal-nodejs-bookshelf-base-repository')`** and pass the
`type` of the model that the repository should manager

For example

```javascript
const BaseRepository = require('quantal-nodejs-bookshelf-base-repository')
const GiphyModel = require('../../models/giphy')

class GiphyRepository extends BaseRepository {
  /**
   * Repositories must call BaseRepository constructor
   */
  constructor () {
    super(GiphyModel)
  }
}

module.exports = GiphyRepository
```


#### Writing Tests:
##### LoggerAspect and Tests
The logger aspect is used to instrument all logs so that log lines can automatically be injected with
properties such as the **`traceId`** and **`event`**  automatically and also to propagate these common 
properties to subsequent log calls. However when testing, this behavior of the LoggerAspect might be undesirable as the 
component under test may not be in a position to inject the automatically propagated props. However
log statements in the component may expect these auto propagated props for log calls to succeed. In
such cases it is better to disable the LoggerAspect so that log statements can succeed. Consider the
code below, the  service method **`sendEmailByTemplate`** calls **`logger.info`** method. The **`logger.info`**
expects that **`traceId`** and **`event`** be passed as arguments or should have been set in the MDC, 
however **`traceId`** and **`event`** have already been set by the caller of this method in the MDC 
and hence do not need to be set in **`sendEmailByTemplate`**.
However, when testing the **`sendEmailByTemplate`**  method, the test will fail and complain
that the logger expects **`traceId`** and **`event`** to have been provided. As there is no way for the
test to set the **`traceId`** and **`event`**, the easiest way to get around this issue is to disable
the `LoggerAspect` so that the logger is disabled from expecting **`traceId`** and **`event`**
as shown below


####### Email Service
```javascript 1.8
'use strict'
const _ = require('lodash')
const Exceptions = require('../../../app/exceptions')
const EmailRepository = require('../../../app/repositories/email')
const Hoek = require('hoek')
const logger = require('../../logger').logger
const Events = require('../../events')

class EmailService {
  constructor (emailRepository, mailgun) {
    Hoek.assert((!_.isEmpty(mailgun)), new Exceptions.IllegalArgumentError('mailgun cannot be null  and must be an instance of Mailgun'))
    Hoek.assert((emailRepository !== null && emailRepository !== undefined && (emailRepository instanceof EmailRepository)), new Exceptions.IllegalArgumentError('emailRepository cannot be null  and must be an instance of EmailRepository'))
    this.mailgun = mailgun
    this.emailRepository = emailRepository
  }

  sendEmailByTemplate (templateName, templateTokens) {
    return this.emailRepository.findByTemplateName(templateName)
          .then(template => {
            const emailDetails = {
              from: from,
              to: to,
              subject: template.subject,
              text: template.text
            }
            logger.info(Object.assign({}, {templateName}, emailDetails, {subEvent: Events.EMAIL_TEMPLATE_RETRIEVE}), 'sending email to %s', to)
            return this.mailgun.messages().send(emailDetails)
          })
  }
}
```

####### Disable LoggerAspect In Tests
```javascript 1.8
const Code = require('code')
const expect = Code.expect
const sinon = require('sinon')
const sinonStubPromise = require('sinon-stub-promise')
sinonStubPromise(sinon)
const Initializer = require('../../app/initializer')

describe('Node Microservice Template Facade Tests', () => {

  beforeEach(() => {
    // Disable the aspect logger so that we dont engage the MDC when log methods are
    // called in the services as that would require us to provide the traceId and event
    // which we  cannot easily inject
    Initializer.getLoggerAspect().disable()
  })

  it('should be dummy facade test', () => {

  })
})
```

####### Enabling LoggerAspect In Tests

You may also enable the **`LoggerAspect`** for a particular test. When **`LoggerAspect`** is enabled in a test, 
as described above, you may not be in a position to set **`traceId`** and **`event`**.
In such an instance it is recommended that  you disable the logger from expecting **`traceId`** and **`event`**
to be set. See below 

```javascript 1.8

const Code = require('code')
const expect = Code.expect
const sinon = require('sinon')
const sinonStubPromise = require('sinon-stub-promise')
sinonStubPromise(sinon)
const Initializer = require('../../app/initializer')
const controller = new Initializer()
const supertest = require('supertest-promised')(controller.getApp())

describe('Node Microservice Template Controller Tests', () => {

  beforeEach(() => {
    // Initializer.getLoggerAspect().disable()
    Initializer.getLoggerAspect().enable()

    // Disables the loggers from expecting the traceId to be provided / set for
    // every log statement
    Initializer.getLoggerAspect().setRequireTraceId(false)

    // Disables the loggers from expecting the event to be provided / set for
    // every log statement
    Initializer.getLoggerAspect().setRequireEvent(false)
  })

  it('should be dummy controller test', () => {

  })
})

```

 NOTES:
 - You should use at least node version 6
 - The API should follow RESTful practices
 - The code style defined in the `.eslintrc`
