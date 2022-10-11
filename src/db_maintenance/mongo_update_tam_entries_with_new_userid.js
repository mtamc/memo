#!/usr/bin/env node

require('dotenv').config()
const { mongo } = require('../api/utils/db/db')

const entryCollections = [
  'bookEntries',
  'filmEntries',
  'tvShowEntries',
  'gameEntries',
]

const OLD_USER_ID = '036e538c-e332-4744-a132-0b15f24b7f43'
const NEW_USER_ID = 'google-oauth2|104210559533150376077'

const main = async () => {
  for (const collectionName of entryCollections) {
    await mongo((db) => db
      .collection(collectionName)
      .updateMany({ userId: OLD_USER_ID }, { $set: { userId: NEW_USER_ID } })
    )
    console.log(`success updating ${collectionName}`)
  }
}

main()
