#!/usr/bin/env node

require('dotenv').config()
const fs = require('fs')
const { createManyFromBackup, deleteAllEntries } = require('./utils')

const backups = [
  './backup_bookEntries_2022-02-04T16:04:00.514Z.json',
  './backup_filmEntries_2022-02-04T16:03:58.480Z.json',
  './backup_tvShowEntries_2022-02-04T16:03:56.862Z.json',
  './backup_gameEntries_2022-02-04T16:03:59.989Z.json',
]

;(async () => {
  // await deleteAllEntries()

  for (const backup of backups) {
    const entries = JSON.parse(fs.readFileSync(backup))
    createManyFromBackup(entries)
  }
})()
