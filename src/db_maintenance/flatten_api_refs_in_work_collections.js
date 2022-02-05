#!/usr/bin/env node
// It seems that transforming
// { name: 'igdb', ref: '123' }
// into `igdb__123` is necessary
// in order to make that field
// searchable by index
require('dotenv').config()
const fs = require('fs')
const { _findAllInCollection } = require('../api/utils/db/unsafe_functions')
const { updateMany } = require('./utils')

;(async () => {
  for (const collection of ['books', 'games', 'tvShows', 'films']) {
    const works = (await _findAllInCollection(collection)).data

    fs.writeFileSync(
      `../../../backup_${collection}_${new Date().toISOString()}.json`,
      JSON.stringify(works)
    )

    const fixed =
      works.map((w) => ({
        ...w,
        data: {
          ...w.data,
          apiRefs: w.data.apiRefs?.map(({ name, ref }) => `${name}__${ref}`)
        }
      }))

    updateMany(fixed)
  }
})()
