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

    const reviewCollectionName = entryCollectionName.replace('Entries', 'Reviews')

    const entries = (await _findAllInCollection(entryCollectionName)).data

    // Create the review collection and get its ref
    const { ref: reviewCollectionRef } = await db.query(
      q.CreateCollection({ name: reviewCollectionName })
    )

    // Create index to search reviews by associated entryRef
    await db.query(
      q.CreateIndex({
        name: `${reviewCollectionName}__entryRef`,
        source: reviewCollectionRef,
        terms: [
          { field: ['data', 'entryRef'] },
        ]
      })
    )

    // Create the review data
    const reviewData = entries.map(({ ref, data }) => ({
      text: data.review || "",
      entryRef: ref,
    }))

    // Put the review data inside the collectino
    await db.query(
      q.Map(
        reviewData,
        q.Lambda(
          'review',
          q.Create(reviewCollectionRef, { data: q.Var('review') })
        )
      )
    )
  }
})()
