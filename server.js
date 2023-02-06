// require necessary NPM packages
const express = require('express')
const bodyParser = require('body-parser') // added 9/8/21
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config() // added 9/8/21

const axios = require('axios') // added 9/8/21

// require route files
const exampleRoutes = require('./app/routes/example_routes')
const userRoutes = require('./app/routes/user_routes')
const movieRoutes = require('./app/routes/movie_routes')
const genreRoutes = require('./app/routes/genre_routes')

// require middleware
const errorHandler = require('./lib/error_handler')
const requestLogger = require('./lib/request_logger')

// require database configuration logic
// `db` will be the actual Mongo URI as a string
const db = require('./config/db')

// require configured passport authentication middleware
const auth = require('./lib/auth')

// define server and client ports
// used for cors and local port declaration

// const serverDevPort = 4741
const serverDevPort = 4742

// const clientDevPort = 7165
const clientDevPort = 7165

// added 9/8/21
// establish database connection
// use new version of URL parser
// use createIndex instead of deprecated ensureIndex
mongoose.Promise = global.Promise
mongoose.connect(db, {
  // useMongoClient: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

// instantiate express application object
const app = express()

// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${clientDevPort}` }))

// define port for API to run on
const port = process.env.PORT || serverDevPort

// added 9/8/21

// this middleware makes it so the client can use the Rails convention
// of `Authorization: Token token=<token>` OR the Express convention of
// `Authorization: Bearer <token>`
app.use((req, res, next) => {
  if (req.headers.authorization) {
    const auth = req.headers.authorization
    // if we find the Rails pattern in the header, replace it with the Express
    // one before `passport` gets a look at the headers
    req.headers.authorization = auth.replace('Token token=', 'Bearer ')
  }
  next()
})

const apiKey = process.env.API_KEY
const apiUrl = process.env.apiUrl

app.get('/api/movies', (req, res, next) => {
  axios.get(`${apiUrl}/movie/popular${apiKey}`)
    .then(response => { res.status(200).json(response.data) })
    .catch((response) => {
      if (response.status === undefined) {
        console.log('unauthorized')
      }
    })
})

app.get('/api/movies', (req, res, next) => {
  axios.get(`${apiUrl}/search/movie/${apiKey}/`)
    .then(response => { res.status(200).json(response.data) })
    .catch((response) => {
      if (response.status === undefined) {
        console.log('unauthorized')
      }
    })
})

// register passport authentication middleware
app.use(auth)

// added 9/8/21
// add `bodyParser` middleware which will parse JSON requests into
// JS objects before they reach the route files.
// The method `.use` sets up middleware for the Express application
app.use(bodyParser.json())
// this parses requests sent by `$.ajax`, which use a different content type
app.use(bodyParser.urlencoded({ extended: true }))

// add `express.json` middleware which will parse JSON requests into
// JS objects before they reach the route files.
// The method `.use` sets up middleware for the Express application
app.use(express.json())
// this parses requests sent by `$.ajax`, which use a different content type
app.use(express.urlencoded({ extended: true }))

// log each request as it comes in for debugging
app.use(requestLogger)

// register route files
app.use(exampleRoutes)
app.use(userRoutes)
app.use(movieRoutes)
app.use(genreRoutes)

// register error handling middleware
// note that this comes after the route middlewares, because it needs to be
// passed any error messages from them
app.use(errorHandler)

// run API on designated port (4741 in this case)
app.listen(port, () => {
  console.log('listening on port ' + port)
})

// needed for testing
module.exports = app
