#!/usr/bin/env node
// some duration values in commonMetadata are broken due to a bug
// (whilst the override value is correct)
// so for now let's just replace every duration value in
// commonMetadata with the override value if exists

require('dotenv').config()
const fs = require('fs')
const { _findAllInCollection } = require('../api/utils/db/unsafe_functions')
const { updateMany } = require('./utils')

const collections = [
  'tvShowEntries',
  'filmEntries',
  'gameEntries',
  'bookEntries'
]

;(async () => {
  for (const collection of collections) {
    const entries = (await _findAllInCollection(collection)).data
    fs.writeFileSync(
      `../../../backup_${collection}_${new Date().toISOString()}.json`,
      JSON.stringify(entries)
    )

  const fixed = entries
    .map((e) => ({
      ...e,
      data: {
        ...e.data,
        commonMetadata: {
          ...e.data.commonMetadata,
          duration: e.data.overrides?.duration || e.data.commonMetadata?.duration
        }
      }
    }))

    updateMany(fixed)
  }
})()
