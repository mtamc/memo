/** @typedef {import('mongodb').Db} Db */
const { MongoClient, ServerApiVersion } = require('mongodb')
const { throwIt } = require('../general')

const mongoClient = new MongoClient(process.env.MONGODB_URL ?? throwIt('MONGODB_URL not set'), {
  serverApi: ServerApiVersion.v1,
})

/** @type {Db | undefined} */
let mdb

/** @type {<T>(query: (db: Db) => Promise<T>) => Promise<T>} */
const mongo = async (query) => {
  if (mdb === undefined) {
    await mongoClient.connect()
    mdb = mongoClient.db('memo')
  }

  return query(mdb)
}

module.exports = {
  mongo,
}
