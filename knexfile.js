// Update with your config settings.

module.exports = {

  development: {
    client: (process.env.DB_TYPE ? process.env.DB_TYPE : 'postgresql'),
    connection: {
      database: (process.env.DB_NAME ? process.env.DB_NAME : 'postgres'),
      user: (process.env.DB_USER ? process.env.DB_USER : 'postgres'),
      password: (process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'postgres'),
      host: (process.env.DB_HOST ? process.env.DB_HOST : 'localhost'),
      port: (process.env.DB_PORT ? process.env.DB_PORT : '5432')
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: (process.env.DB_TYPE ? process.env.DB_TYPE : 'postgresql'),
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: (process.env.DB_TYPE ? process.env.DB_TYPE : 'postgresql'),
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

}
