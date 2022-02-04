#!/usr/bin/env node

require('dotenv').config()
const fs = require('fs')
const { _findAllInCollection } = require('../api/utils/db/unsafe_functions')
const { updateMany } = require('./utils')

;(async () => {
  const entries = (await _findAllInCollection('tvShowEntries')).data

  fs.writeFileSync('backup_tv_entries-02-04.json', JSON.stringify(entries))

  const fixed = entries
    .map((e) => ({
      ...e,
      data: {
        ...e.data,
        commonMetadata: {
          ...e.commonMetadata,
          externalUrls: e.data.commonMetadata.externalUrls?.map(({ name, url }) => ({
            name,
            url: url.replace(/\/movie\//g, '/tv/')
          }))
        }
      }
    }))

  updateMany(fixed)
})()
