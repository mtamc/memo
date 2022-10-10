#!/usr/bin/env node
require("dotenv").config();
const fs = require("fs");
const { MongoClient, ServerApiVersion } = require("mongodb")

const uri =
  process.env.MONGODB_URL

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

const collections = [
  "bookEntries",
  "bookReviews",
  "books",
  "filmEntries",
  "filmReviews",
  "films",
  "gameEntries",
  "gameReviews",
  "games",
  "tvShowEntries",
  "tvShowReviews",
  "tvShows",
  "users",
]

const logAndKill = (err) => { console.log(err); throw err }
const logSomething = (msg) => (valueToReturn) => (console.log(msg), valueToReturn)
const withLogs = (successMsg, promise) => promise.then(logSomething(successMsg)).catch(logAndKill)

const main = async () => {
  await withLogs('Connected', client.connect())
  const db = client.db('memo')
  for (const collectionName of collections) {
    const collection = db.collection(collectionName)
    const docs = JSON.parse(fs.readFileSync(`./backup-2022-10-10/${collectionName}.json`))
    const docsReadyForMongo = docs.map((dcmt) => ({
      _id: dcmt.ref['@ref'].id,
      ...dcmt.data,
    }))
    await withLogs(
      `successfully restored ${collectionName}`,
      collection.insertMany(docsReadyForMongo),
    )
  }
  client.close()
}

main()
