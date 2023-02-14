const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  released: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  categories: {
    type: Array,
    required: false
  },
  directors: {
    type: Array,
    required: false
  },
  runtime: {
    type: String,
    required: false
  },
  tagline: {
    type: String,
    required: false
  },
  budget: {
    type: String,
    required: false
  },
  revenue: {
    type: String,
    required: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
    required: true
  }
}, {
  timestamps: true
})

// const collectionModel = mongoose.model('Collection', collectionSchema)

module.exports = mongoose.model('Movie', movieSchema)
