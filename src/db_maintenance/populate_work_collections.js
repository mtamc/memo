#!/usr/bin/env node
require('dotenv').config()
const fs = require('fs')
const faunadb = require('faunadb')
const q = faunadb.query
const { db } = require('../api/utils/db/db')
const { _findAllInCollection } = require('../api/utils/db/unsafe_functions')
const { updateMany } = require('./utils')

const collections = [
  { entriesCollection: 'tvShowEntries', worksCollection: 'tvShows' },
  { entriesCollection: 'bookEntries', worksCollection: 'books' },
  { entriesCollection: 'gameEntries', worksCollection: 'games' },
  { entriesCollection: 'filmEntries', worksCollection: 'films' },
]

;(async () => {
  for (const { entriesCollection, worksCollection } of collections) {
    const entries = (await _findAllInCollection(entriesCollection)).data

    fs.writeFileSync(
      `../../../backup_${entriesCollection}_${new Date().toISOString()}.json`,
      JSON.stringify(entries)
    )

    const works = entries.map(e => e.data.commonMetadata)

    const result = await db.query(
      q.Map(
        works,
        q.Lambda(
          "data",
          q.Create(q.Collection(worksCollection), { data: q.Var("data") })
        )
      )
    )

    const fixedEntries =
      entries.map((e, i) => ({
        ref: e.ref,
        data: {
          workRef: result[i].ref.id
        }
      }))

    updateMany(fixedEntries)
  }
})()
