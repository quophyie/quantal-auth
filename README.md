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

 NOTES:
 - You should use at least node version 6
 - The API should follow RESTful practices
 - The code style defined in the `.eslintrc`
