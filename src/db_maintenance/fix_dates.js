#!/usr/bin/env node
//wip

require('dotenv').config()
const fs = require('fs')
const { _findAllInCollection } = require('../api/utils/db/unsafe_functions')
const { updateMany } = require('./utils')

const collections = ['tvShowEntries', 'filmEntries', 'gameEntries', 'bookEntries']

;(async () => {

  for (const collection of collections) {
    const entries = (await _findAllInCollection(collection)).data
    fs.writeFileSync(
      `backup_${collection}_${new Date().toISOString()}.json`,
      JSON.stringify(entries)
    )

  const fixed = entries
    .map((e) => ({
      ...e,
      data: {
        ...e.data,
        startedDate: fixDate(e.data.startedDate),
        completedDate: fixDate(e.data.startedDate)
      }
    }))
    // Only keep those entries that have been changed
    .filter((e, i) => e !== entries[i])
  }

  const refAndDataTuples = fixed.map(({ ref, data }) => [ref, data])

  // Update every entry by replacing its data with the new data we got
  updateMany(refAndDataTuples)
})()
