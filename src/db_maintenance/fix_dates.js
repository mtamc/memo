#!/usr/bin/env node

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

const fixDate = (posix) => {
  if (!posix) {
    return undefined
  }
  const date = new Date(posix)
  const year = date.getFullYear()
  if (year > 4000) {
    date.setFullYear(year - 2000)
  } else if (year > 2030) {
    date.setFullYear(year - 100)
  }
  return date.getTime()
}

;(async () => {
  for (const collection of collections) {
    const entries = (await _findAllInCollection(collection)).data
    fs.writeFileSync(
      `backup_${collection}_${new Date().toISOString()}.json`,
      JSON.stringify(entries)
    )

  const fixed = entries
    .map((e) => ({
      ref: e.ref,
      data: {
        startedDate: fixDate(e.data.startedDate),
        completedDate: fixDate(e.data.completedDate),
      }
    }))

    updateMany(fixed)
  }
})()
