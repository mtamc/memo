require('dotenv').config()
const fs = require('fs')
const faunadb = require('faunadb')
const q = faunadb.query
const { db } = require('../api/utils/db/db')

const updateMany = (entries) =>
  db.query(
    q.Map(
      toRefAndDataTuples(entries),
      q.Lambda(
        ["ref", "data"],
        q.Update(q.Var("ref"), { data: q.Var("data") })
      )
    )
  )
    .then(console.log)
    .catch(console.error)

module.exports = {
  updateMany
}

///////////////////////////////////////////////////////////////////////////////

const toRefAndDataTuples = (entries) => entries.map(({ ref, data }) => [ref, data])

