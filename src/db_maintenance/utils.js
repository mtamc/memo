require('dotenv').config()
const fs = require('fs')
const faunadb = require('faunadb')
const q = faunadb.query
const { db } = require('../api/utils/db/db')

const updateMany = (entries, { fromBackup } = { fromBackup: false }) =>
  db.query(
    q.Map(
      fromBackup
        ? toRefAndDataTuplesFromBackup(entries)
        : toRefAndDataTuples(entries),
      q.Lambda(
        ["ref", "data"],
        q.Update(q.Var("ref"), { data: q.Var("data") })
      )
    )
  )
    .catch(console.error)

const createManyFromBackup = (entries) =>
  db.query(
    q.Map(
      toCollectionAndDataTuples(entries),
      q.Lambda(
        ["col", "data"],
        q.Create(q.Collection(q.Var("col")), { data: q.Var("data") })
      )
    )
  )
    .catch(console.error)

const deleteAllEntries = async () => {
  for (const collection of entryCollections) {
    await db.query(
      q.Map(
        q.Paginate(
          q.Documents(q.Collection(collection)),
          { size: 100000 }
        ),
        q.Lambda(
          ['ref'],
          q.Delete(q.Var('ref'))
        )
      )
    )
  }
}

module.exports = {
  updateMany,
  deleteAllEntries,
  createManyFromBackup,
}

///////////////////////////////////////////////////////////////////////////////

const toRefAndDataTuples = (entries) => entries.map(({ ref, data }) => [ref, data])

const toCollectionAndDataTuples = (entries) => entries.map(({ ref, data }) => [
  ref['@ref'].collection['@ref'].id, data
])

const toRefAndDataTuplesFromBackup = (entries) =>
  entries.map(({ ref, data }) => [
    q.Ref(
      q.Collection(ref['@ref'].collection['@ref'].id),
      ref['@ref'].id
    ),
    data
  ])

const entryCollections = [
  'filmEntries',
  'bookEntries',
  'tvShowEntries',
  'gameEntries',
]
