#!/usr/bin/env node

require('dotenv').config()
const fs = require('fs')
const { _findAllInCollection } = require('../api/utils/db/unsafe_functions')
const { updateMany } = require('./utils')
const faunadb = require('faunadb')

const reviewCollections = [
  'bookReviews',
  'filmReviews',
  'tvShowReviews',
  'gameReviews',
]

;(async () => {
  for (const reviewCollectionName of reviewCollections) {

    const entries = (await _findAllInCollection(reviewCollectionName)).data

    const fixed = entries.map((e) => ({
      ref: e.ref,
      data: {
        entryRef: e.data.entryRef.id
      }
    }))

    updateMany(fixed)
  }
})()
