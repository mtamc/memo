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
  const entries = (await _findAllInCollection('gameEntries')).data

  // fs.writeFileSync('backup.json', JSON.stringify(tvEntries))

  const scores = entries.map(e => e.data.score)

  const fixed = entries.map(e => ({
    ...e,
    data: {
      ...e.data,
      score: parseInt(e.data.score) || null,
    }
  }))

  const refAndDataTuples = fixed.map(({ ref, data }) => [ref, data])

  //Update every entry by replacing its data with the new data we got
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
