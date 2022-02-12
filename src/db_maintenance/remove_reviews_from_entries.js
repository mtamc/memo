#!/usr/bin/env node

require('dotenv').config()
const fs = require('fs')
const { _findAllInCollection } = require('../api/utils/db/unsafe_functions')
const { updateMany } = require('./utils')
const faunadb = require('faunadb')
const q = faunadb.query
const { db } = require('../api/utils/db/db')

const entryCollections = [
  'bookEntries',
  'filmEntries',
  'tvShowEntries',
  'gameEntries',
]

;(async () => {
  for (const entryCollectionName of entryCollections) {

    const entries = (await _findAllInCollection(entryCollectionName)).data
    fs.writeFileSync(
      `../../../backup_${entryCollectionName}_${new Date().toISOString()}.json`,
      JSON.stringify(entries)
    )

    const entriesWithoutReviews =
      entries.map((e) => ({
        ref: e.ref,
        data: {
          review: null,
        }
      }))

    updateMany(entriesWithoutReviews)
  }
})()

