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
  const entries = (await _findAllInCollection('filmEntries')).data

  fs.writeFileSync('backup_film_entries_2022-02-01.json', JSON.stringify(entries))

  const completedDates = entries.map(e => e.data.completedDates)
  console.log(JSON.stringify(completedDates))

  // const fixed = entries.map(e => ({
    // ...e,
    // data: {
      // ...e.data,
      // score: parseInt(e.data.score) || null,
    // }
  // }))

  // const refAndDataTuples = fixed.map(({ ref, data }) => [ref, data])

  // //Update every entry by replacing its data with the new data we got
  // db.query(
    // q.Map(
      // refAndDataTuples,
      // Lambda(
        // ["ref", "data"],
        // Update(Var("ref"), { data: Var("data") })
      // )
    // )
  // )
    // .then(console.log)
    // .catch(console.error)

})()
