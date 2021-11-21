const express = require('express')

const Movie = require('../models/movie')

const passport = require('passport')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')

const requireToken = passport.authenticate('bearer', {
  session: false
})

const router = express.Router()

// "old"
// // INDEX
// router.get('/movies', requireToken, (req, res, next) => {
//   Movie.find({ owner: req.user.id })
//     // .populate({
//     //   path: 'movies'
//     // })
//     .then(movies => {
//       return movies.map(movie => movie.toObject())
//     })
//     .then(movies => {
//       res.json({ movies })
//     })
//     .catch(next)
// })

// same as recipe app
// INDEX
router.get('/movies', requireToken, (req, res, next) => {
  Movie.find({ owner: req.user.id })
    .populate('owner')
    // .populate({
    //   path: 'movies'
    // })
    .then(movies => {
      return movies.map(movie => movie.toObject())
    })
    .then(movies => { res.status(200).json({ movies: movies }) })
    .catch(next)
})

// SHOW
router.get('/movies/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Movie.findById(req.params.id)
    .populate('genre')
    .then(handle404)
    // before
    // .then(movie => {
    //   return movie
    // })
    // .then(movie => res.json({ movie: movie.toObject() }))
    // after
    .then(movie => res.status(200).json({ movie: movie.toObject() }))
    .catch(next)
})

// CREATE
router.post('/movies', requireToken, (req, res, next) => {
  req.body.movie.owner = req.user.id

  Movie.create(req.body.movie)
    .then(movie => {
      // before
      // res.status(201).json({ movie: movie.toObject() })
      // after
      res.status(201).json({ genre: movie.toObject() })
    })
    .catch(next)
})

// UPDATE
router.patch('/movies/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.movie.owner
  Movie.findById(req.params.id)
    .then(handle404)
    .then(movie => {
      requireOwnership(req, movie)
      return movie.update(req.body.movie)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
router.delete('/movies/:id', requireToken, (req, res, next) => {
  Movie.findById(req.params.id)
    .then(handle404)
    .then(movie => {
      requireOwnership(req, movie)
      movie.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
