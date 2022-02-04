#!/usr/bin/env node

require('dotenv').config()
const fs = require('fs')
const faunadb = require('faunadb')
const q = faunadb.query
const {
  Get,
  Ref,
  Collection,
  Create,
  Match,
  Index,
  Paginate,
  Var,
  Documents,
  Lambda,
  Update,
  Delete,
} = q
const { db } = require('../api/utils/db/db')
const { _findAllInCollection } = require('../api/utils/db/unsafe_functions')

;(async () => {
  const entries = (await _findAllInCollection('tvShowEntries')).data

  fs.writeFileSync('backup_tv_entries-02-04.json', JSON.stringify(entries))

  console.log(entries[0])
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
    // Only keep those entries that have been changed
    .filter((e, i) => e !== entries[i])
  console.log(fixed[0])

  const refAndDataTuples = fixed.map(({ ref, data }) => [ref, data])

  // Update every entry by replacing its data with the new data we got
  db.query(
    q.Map(
      refAndDataTuples,
      Lambda(
        ["ref", "data"],
        Update(Var("ref"), { data: Var("data") })
      )
    )
  )
    .then(console.log)
    .catch(console.error)
})()
