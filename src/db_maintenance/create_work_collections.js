#!/usr/bin/env node
require('dotenv').config()
const fs = require('fs')
const faunadb = require('faunadb')
const q = faunadb.query
const { db } = require('../api/utils/db/db')
// Creating collections and indexes
// can be done from the dashboard,
// but here's an example of doing it via JS/FQL
// (might be broken.. need to look into it)

;['books', 'tvShows', 'films', 'games']
  .forEach(async (collectionName) => {
    const { ref, name } = await db.query(
      q.CreateCollection({
        name: collectionName
      })
    )

    await db.query(
      q.CreateIndex({
        name: `${collectionName}__apiRefs`,
        source: ref,
        terms: [
          { field: ['data', 'apiRefs'] },
        ]
      })
    )

    await db.query(
      q.CreateIndex({
        name: `${collectionName}__keywords`,
        source: ref,
        terms: [
          { field: ['data', 'keywords'] },
        ]
      })
    )
  })
