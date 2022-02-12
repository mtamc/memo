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
    db.query(
      q.CreateIndex({
        name: `${entryCollectionName}__updatedDate`,
        source: q.Collection(entryCollectionName),
        terms: [
          { field: ['ref'] },
        ],
        values: [
          { field: ['data', 'updatedDate'], reverse: true },
          { field: ['ref'] },
        ]
      })
    )
  }
})()
