'use strict'

// creating a base name for the mongodb
const mongooseBaseName = 'express-api-template'

// create the mongodb uri for development and test
const database = {
  development: `mongodb://db/${mongooseBaseName}-development`,
  test: `mongodb://db/${mongooseBaseName}-test`
}

// Identify if development environment is test or development
// select DB based on whether a test file was executed before `server.js`
const localDb = process.env.TESTENV ? database.test : database.development

// Environment variable DB_URI will be available in
// heroku production evironment otherwise use test or development db
const currentDb = process.env.DB_URI || localDb

console.log('The Current Database: ',  currentDb)

module.exports = currentDb
