#!/usr/bin/env node

require('dotenv').config()
const fs = require('fs')
const { _findAllInCollection } = require('../api/utils/db/unsafe_functions')
const { updateMany } = require('./utils')

;(async () => {
  const entries = (await _findAllInCollection('gameEntries')).data

  fs.writeFileSync('backup.json', JSON.stringify(entries))

  const fixed = entries.map(e => ({
    ...e,
    data: {
      ...e.data,
      score: parseInt(e.data.score) || null,
    }
  }))

  updateMany(fixed)

})()
